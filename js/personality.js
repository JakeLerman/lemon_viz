var width = 1618,
    height = 1000;
 
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
 
    console.log("nest",nest)
 
var treemap = d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true);
 
d3.csv("data/abaye_treemap_adjusted.csv", type, function(error, data) {
  if (error) throw error;
 
  var root = d3.hierarchy({values: nest.entries(data)}, function(d) { return d.values; })
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });
 
  treemap(root);
 
  console.log("treemap",treemap(root))
 
  var node = d3.select("body")
    .selectAll(".node")
    .data(root.leaves())
    .enter().append("div")
      .attr("class", "node")
      .style("left", function(d) { return d.x0 + "px"; })
      .style("top", function(d) { return d.y0 + "px"; })
      .style("width", function(d) { return d.x1 - d.x0 + "px"; })
      .style("height", function(d) { return d.y1 - d.y0 + "px"; })
      .style("background", function(d) {  return color(d.parent.data.key); });
 
  node.append("div")
      .attr("class", "node-label")
      .text(function(d) { return d.data.key + "\n" + d.parent.data.key; });
 
  node.append("div")
      .attr("class", "node-value")
      .text(function(d) { return Math.round(d.value); });
});
 
function type(d) {
  d.adjusted_count = +d.adjusted_count;
  return d;
}