const MARGIN = { LEFT: 0, RIGHT: 200, TOP: 70, BOTTOM: 50 }
const WIDTH = 2000 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 1200 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
.append("g")
.attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

// Lloyds Colour Scheme
const colors = d3.schemePastel1
 
d3.csv("data/Rishonim.csv").then(data => {
  console.log(data)

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
    .call(d3.axisTop(xAxis));
 
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
 
  const bars = svg.selectAll("bars")
  .data(data)
  .join("rect")
    .attr("x", d => xAxis(d['birth']))
    .attr("y", d => yAxis(d['name']))
    .attr("width", d => xAxis(d['death']) - xAxis(d['birth']))
    .attr("height", yAxis.bandwidth())
    .attr("fill", d=> cScale(d.location))
    .join("a")
    .attr("href", d => d.link)
    .attr("target", d => d.link)
    .append("title")
    .text(d => d.name + ': ' + d.birth + ' - ' + d.death)

    // .attr("opacity",d=> cScale(d.Perc_Left))
 
  svg.selectAll("labels")
    .data(data)
    .join("text")
    .attr("x", d => xAxis(d['death']))
    .attr("y", d => yAxis(d['name'])+yAxis.bandwidth())
    .text(d => d.name)
 
  })