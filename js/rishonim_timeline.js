const MARGIN = { LEFT: 100, RIGHT: 50, TOP: 70, BOTTOM: 50 }
const WIDTH = 1618 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 1000 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
 
var format = d3.formatLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["£", ""]
}).format("$,d");
 
var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10
        .map(function(c) { c = d3.rgb(c); c.opacity = 0.6; return c; }));
 
var nest = d3.nest()
    .key(function(d) { return d.Seder; })
    .key(function(d) { return d.Masechet; })
    .rollup(function(d) { return d3.sum(d, function(d) { return d.adjusted_count; }); });
 
var treemap = d3.treemap()
    .size([WIDTH, HEIGHT])
    .padding(1)
    .round(true);

function type(d) {
    d.adjusted_count = +d.adjusted_count;
    return d;
  }

// create a tooltip
var Tooltip = d3.select("#chart-area")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  Tooltip
  .style("opacity", 1)
  d3.select(this)
  .style("stroke", "black")
  .style("opacity", 1)
  }
var mousemove = function(d) {
  Tooltip
  .html("Frequency Rating: " + Math.round(d.value))
  .style("left", (d3.mouse(this)[0]+10) + "px")
  .style("top", (d3.mouse(this)[1]) + "px")
  }
var mouseleave = function(d) {
  Tooltip
  .style("opacity", 0)
  d3.select(this)
  .style("stroke", "none")
  .style("opacity", 0.8)
  }
 
d3.csv("data/abaye_treemap_adjusted.csv", type, function(error, data) {
  if (error) throw error;
 
  var root = d3.hierarchy({values: nest.entries(data)}, function(d) { return d.values; })
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });
 
  treemap(root);

 
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr("x", function(d) { return d.x0 + "px"; })
      .attr("y", function(d) { return d.y0 + "px"; })
      .attr("width", function(d) { return d.x1 - d.x0 + "px"; })
      .attr("height", function(d) { return d.y1 - d.y0 + "px"; })
      .style("fill", function(d) {  return color(d.parent.data.key); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
 
  // node.append("div")
  //     .attr("class", "node-label")
  //     .text(function(d) { return d.data.key + "\n" + d.parent.data.key; });
 
  // node.append("div")
  //     .attr("class", "node-value")
  //     .text(function(d) { return Math.round(d.value); });

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0  + 10})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0  + 20})    // +20 to adjust position (lower)
      .text(function(d){ return d.data.key})
      .attr("font-size", "15px")
      .attr("fill", "white")

});