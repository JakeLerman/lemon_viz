var margin = ({top: 10, right: 60, bottom: 50, left: 60})
var height = 300, width=600;
var font = 'Georgia'
  
  // append the svg object to the body of the page
  var svg = d3.select(".chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
  var g = svg
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // X axis
const x = d3.scaleBand()
  .range([ 0, width - margin.left - margin.right])
  .padding(0.2);

  // Add Y axis
const y = d3.scaleLinear()
  .domain([0, 100])
  .range([height - margin.top - margin.bottom, 0]);
  g.append("g")
    .call(d3.axisLeft(y))
    .style("color","#464655ff");

        
  // Colour Scale
  const sedarim = ["Kodashim", "Tahorot", "Nashim", "Nezikin","Moed","Zeraim"]

  const masechta_colours = d3.scaleOrdinal().domain(sedarim).range(d3.schemePastel2)

  // Parse the Data
  d3.csv("data/agada_halacha.csv").then( function(raw_data) {
    data = raw_data

  // Add X Axis
    x.domain(raw_data.map(d => d.Masechet))
    g.append("g").attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(x))
    .style("color","#464655ff")
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-35)")
      .style("text-anchor", "end")
      .style("color","#464655ff")
      .attr("font-family", "Calibri")

    update(data)
  })

  function update(data) {
    init()

    // standard transition time for the visualization
    const t = d3.transition().duration(1000)

    // filter data based on selection
    var Seder = "all"

    const filteredData = data.filter(d => {
      if (Seder === "all") return true
      else {return d.Seder == Seder}
        })

// JOIN new data with old elements.
const bars = g.selectAll("rect")
.data(filteredData, d => d.Masechet)

bars.join(
  function(enter) {return enter.append("rect")
                      .attr("x", d => x(d.Masechet))
                      .attr("y", d => y(d.percent_aggada))
                      .transition(t)
                      .attr("width", x.bandwidth())
                      .attr("height", d => height - margin.top - margin.bottom - y(d.percent_aggada))
                      .attr("fill", d => masechta_colours(d.Seder))
                      .style('opacity',1)
                        },
  function(update) {return update},
  function(exit) {return exit.transition(t)
                            .style("opacity",0)
                            .remove()
                          }
)
  }

// TODO: Tooltip

//scrollama stuff
//// using d3 for convenience, and storing a selected elements
var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

// initialize the scrollama
var scroller = scrollama();

// resize function to set dimensions on load and on page resize
function handleResize() { 
// 1. update height of step elements for breathing room between steps
	var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style('height', stepHeight + 'px');

	// 2. update height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth;

	graphic
		.style('height', window.innerHeight + 'px');

	// 3. update width of chart by subtracting from text width
	var chartMargin = 32;
	var textWidth = text.node().offsetWidth;
	var chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;
	// make the height 1/2 of viewport
	var chartHeight = Math.floor(window.innerHeight / 2);

	chart
		.style('width', chartWidth + 'px')
		.style('height', chartHeight + 'px');

	// 4. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers

function handleStepEnter(response) {
	// response = { element, direction, index }
	// fade in current step
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})

	// update graphic based on step here
	var stepData = parseFloat(response.element.getAttribute('data-step'));
	console.log(stepData)
	
}

// function handleContainerEnter(response) {
// 	// response = { direction }

// 	// sticky the graphic
// 	graphic.classed('is-fixed', true);
// 	graphic.classed('is-bottom', false);
// }

// function handleContainerExit(response) {
// 	// response = { direction }

// 	// un-sticky the graphic, and pin to top/bottom of container
// 	graphic.classed('is-fixed', false);
// 	graphic.classed('is-bottom', response.direction === 'down');
// }

// kick-off code to run once on load
function init() {
	// 1. call a resize on load to update width/height/position of elements
	handleResize();

	// 2. setup the scrollama instance
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
			container: '#scroll', // our outermost scrollytelling element
			graphic: '.scroll__graphic', // the graphic
			text: '.scroll__text', // the step container
			step: '.scroll__text .step', // the step elements
			offset: 0.7, // set the trigger to be 1/2 way down screen
			debug: false, // display the trigger offset for testing
		})
		.onStepEnter(handleStepEnter)
		//.onContainerEnter(handleContainerEnter)
		//.onContainerExit(handleContainerExit);

	// setup resize event
	window.addEventListener('resize', handleResize);
}