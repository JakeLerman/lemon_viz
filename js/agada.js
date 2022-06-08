const margin = {top: 30, right: 30, bottom: 200, left: 60},
      width = 1000 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  const svg = d3.select("#chart-area")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // X axis
const x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);

const xaxis = svg.append("g").attr("transform", `translate(0, ${height})`)

  // Add Y axis
const y = d3.scaleLinear()
  .domain([0, 100])
  .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .style("color","#464655ff");

        
  // Colour Scale
  const sedarim = ["Kodashim", "Tahorot", "Nashim", "Nezikin","Moed","Zeraim"]

  const masechta_colours = d3.scaleOrdinal().domain(sedarim).range(d3.schemePastel2)

  // Add Legend
//   const legend = svg.append("g")
//   .attr("transform", `translate(${width - 10}, ${10})`)
  
//   sedarim.forEach((sedarim, i) => {
// 	const legendRow = legend.append("g")
// 		.attr("transform", `translate(0, ${i * 20})`)

// 	legendRow.append("rect")
//     .attr("width", 10)
//     .attr("height", 10)
// 		.attr("fill", masechta_colours(sedarim))

// 	legendRow.append("text")
//     .attr("x", -10)
//     .attr("y", 10)
//     .attr("text-anchor", "end")
//     .style("text-transform", "capitalize")
// 	.text(sedarim)
// })

  // Parse the Data
  d3.csv("data/agada_halacha.csv").then( function(raw_data) {
    data = raw_data

  // Add X Axis
    x.domain(raw_data.map(d => d.Masechet))
    xaxis.call(d3.axisBottom(x))
    .style("color","#464655ff")
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-35)")
      .style("text-anchor", "end")
      .style("color","#464655ff")
      .attr("font-family", "Calibri")

    update(data)
  })

  $("#seder-select")
    .on("change", () => {
      update(data)
    })

  function update(data) {

    // standard transition time for the visualization
    const t = d3.transition().duration(1000)

    // filter data based on selection
    const Seder = $("#seder-select").val()

    const filteredData = data.filter(d => {
      if (Seder === "all") return true
      else {return d.Seder == Seder}
        })

// JOIN new data with old elements.
const bars = svg.selectAll("rect")
.data(filteredData, d => d.Masechet)

bars.join(
  function(enter) {return enter.append("rect")
                      .attr("x", d => x(d.Masechet))
                      .attr("y", d => y(d.percent_aggada))
                      .transition(t)
                      .attr("width", x.bandwidth())
                      .attr("height", d => height - y(d.percent_aggada))
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

// TODO: Working Legend, Tooltip