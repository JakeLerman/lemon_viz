const MARGIN = { LEFT: 50, RIGHT: 200, TOP: 110, BOTTOM: 50 }
const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 2000 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .attr("viewBox", [0, 0, WIDTH + MARGIN.LEFT + MARGIN.RIGHT, HEIGHT + MARGIN.TOP + MARGIN.BOTTOM])
  .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

// Lloyds Colour Scheme
const colors = d3.schemePastel1
 
d3.csv("data/Achronim_I.csv").then(data => {

  // Data Pre-Processing
data.forEach(element => {
    element['birth'] = Number(element['birth'])
    element['death'] = Number(element['death'])
    return data
  })
 
  // Sort data
  data.sort(function(a,b) { return d3.descending(a['birth'], b['birth']) || d3.descending(a['death'], b['death']) })
 
  // X axis
  const xAxis = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d["birth"]),
      d3.max(data, (d) => d["death"]),
    ])
    .range([0, WIDTH]);
  svg
    .append("g")
    .attr("transform", `translate(0,-10)`)
    .call(d3.axisTop(xAxis).tickFormat(d3.format("d")));
 
  // Y Axis
  const yAxis = d3
    .scaleBand()
    .domain(data.map((d) => d["name"]))
    .range([HEIGHT, 0])
    .paddingInner(0.3);
  // svg.append("g").call(d3.axisLeft(yAxis))

  const locations = [...new Set(data.map(d=>d.location))]

  const cScale = d3.scaleOrdinal()
    .domain(locations)
    .range(colors)
  
    // Brush
    const brush = d3.brushX()
      .handleSize(10)
			.extent([[0, 0], [WIDTH, 100]])
			.on("brush", brushed)

		// append brush component
    svg.append("g")
    .attr("transform", `translate(0,${-MARGIN.TOP})`)
			.attr("class", "brush")
			.call(brush)
 
  svg.selectAll("bars")
  .data(data)
  .join("a")
  .attr("href", d => d.link)
  .attr("target", d => d.link)
  .append("rect")
    .attr("x", d => xAxis(d['birth']))
    .attr("y", d => yAxis(d['name']))
    .attr("width", d => xAxis(d['death']) - xAxis(d['birth']))
    .attr("height", yAxis.bandwidth())
    .attr("fill", cScale("test")) //d=> cScale(d.location)
    .append("title")
    // .text(d => d.description)
    .text(d => d.name + ': ' + d.birth + ' - ' + d.death)
    // .attr("opacity",d=> cScale(d.Perc_Left))
 
  svg.selectAll("labels")
    .data(data)
    .join("text")
    .attr("x", d => xAxis(d['death']))
    .attr("y", d => yAxis(d['name'])+yAxis.bandwidth())
    .text(d => d.name)
    // .style("fill", d => d.location)
    .style("font-size",9)
    .style("font-weight","bold")


  function brushed(event) {
    const selection = event.selection;
    if (selection === null) {
      console.log("null")
    } else {
      const [x0, x1] = selection.map(xAxis.invert);
      console.log(x0, x1)
    }
  }

  // Legend
  //   svg.append("g")
  // .attr("class", "legend")
  // .attr("transform", `translate(${WIDTH},10)`);
  // const legend = d3.legendColor().scale(cScale)
  // svg.select(".legend")
  // .call(legend);
 
  })

