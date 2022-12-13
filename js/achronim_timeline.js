// Global Variables
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

let data
 
// Scales/Axis
const xAxis = d3
.scaleLinear()
.range([0, WIDTH]);
const yAxis = d3
    .scaleBand()
    .range([HEIGHT, 0])
    .paddingInner(0.3);
const colors = d3.schemePastel1
const cScale = d3.scaleOrdinal()
    .range(colors)

  $("#reset-button")
  .on("click", () => {
    initVis()
  })

// Load Data
d3.csv("data/Achronim_I.csv").then(rawdata => {
    // Data Pre-Processing
    rawdata.forEach(element => {
      element['birth'] = Number(element['birth'])
      element['death'] = Number(element['death'])
      return rawdata
    })
    // Sort data
    data = rawdata.sort(function(a,b) { return d3.descending(a['birth'], b['birth']) || d3.descending(a['death'], b['death']) })

    $("#search").autocomplete({source: data.map(d=> d.name),select: function (event, ui) {
      // var label = ui.item.label;
      var value = ui.item.value;
      update(value)
    }})
    
    // init Viz
    initVis()
})

function initVis(){
// clear
svg.selectAll("*").remove();

  // X axis
  xAxis
  .domain([
    d3.min(data, (d) => d["birth"]),
    d3.max(data, (d) => d["death"]),
  ]);
svg
  .append("g")
  .attr("transform", `translate(0,-10)`)
  .call(d3.axisTop(xAxis).tickFormat(d3.format("d")));

// Y Axis
yAxis.domain(data.map((d) => d["name"]))
// svg.append("g").call(d3.axisLeft(yAxis))

const locations = [...new Set(data.map(d=>d.location))]

// Color
cScale
  .domain(locations)

// Bars
svg.selectAll(".bars")
  .data(data)
  .join("a")
  .attr("class","bars")
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
    .text(d => d.name + ': ' + d.birth + ' - ' + d.death + '; ' + d.description)
    // .attr("opacity",d=> cScale(d.Perc_Left))

//Labels  
svg.selectAll(".labels")
    .data(data)
    .join("text")
    .attr("class","labels")
    .attr("x", d => xAxis(d['death']))
    .attr("y", d => yAxis(d['name'])+yAxis.bandwidth())
    .text(d => d.name)
    // .style("fill", d => d.location)
    .style("font-size",9)
    .style("font-weight","bold")

    // Legend
  //   svg.append("g")
  // .attr("class", "legend")
  // .attr("transform", `translate(${WIDTH},10)`);
  // const legend = d3.legendColor().scale(cScale)
  // svg.select(".legend")
  // .call(legend);
  }


function update(name) {
  const filteredData = data.filter(row => row.name == name)
  console.log(filteredData)

  svg.selectAll(".bars")
    .data(filteredData, d => d.name)
    .join(
      function(enter) {
        console.log("enter",enter)
      },
      function(update) {
        update.selectAll("rect").attr("fill","#ff6961")
        console.log("update", update)
      },
      function(exit) {
        console.log("exit",exit)
        return exit.selectAll("rect").style('opacity', 0.5).attr("fill",cScale("test"));
      }
    )

  }
