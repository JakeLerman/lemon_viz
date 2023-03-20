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
d3.tsv("data/bios_sefaria_preprocessed.tsv").then(rawdata => {
    // Data Pre-Processing
    rawdata.forEach(element => {
      element['Birth Year '] = Number(element['Birth Year '])
      element['Death Year'] = Number(element['Death Year'])
      return rawdata
    })
    // Sort data
    data = rawdata.sort(function(a,b) { return d3.descending(a['Birth Year '], b['Birth Year ']) || d3.descending(a['Death Year'], b['Death Year']) })

    console.log(data)

    $("#search").autocomplete({source: data.map(d=> d['Primary English Name']),select: function (event, ui) {
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
    d3.min(data, (d) => d["Birth Year "]),
    d3.max(data, (d) => d["Death Year"]),
  ]);
svg
  .append("g")
  .attr("transform", `translate(0,-10)`)
  .call(d3.axisTop(xAxis).tickFormat(d3.format("d")));

// Y Axis
yAxis.domain(data.map((d) => d["Primary English Name"]))
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
  .attr("href", d => d['English Wikipedia Link'])
  .attr("target", d => d['English Wikipedia Link'])
  .append("rect")
    .attr("x", d => xAxis(d['Birth Year ']))
    .attr("y", d => yAxis(d['Primary English Name']))
    .attr("width", d => xAxis(d['Death Year']) - xAxis(d['Birth Year ']))
    .attr("height", yAxis.bandwidth())
    .attr("fill", cScale("test")) //d=> cScale(d.location)
    .append("title")
    // .text(d => d.description)
    .text(d => d['Primary English Name'] + ': ' + d['Birth Year '] + ' - ' + d['Death Year'] + '; ' + d['English Biography'])
    // .attr("opacity",d=> cScale(d.Perc_Left))

//Labels  
svg.selectAll(".labels")
    .data(data)
    .join("text")
    .attr("class","labels")
    .attr("x", d => xAxis(d['Death Year']))
    .attr("y", d => yAxis(d['Primary English Name'])+yAxis.bandwidth())
    .text(d => d['Primary English Name'])
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
  const filteredData = data.filter(row => row['Primary English Name'] == name)
  console.log(filteredData)

  svg.selectAll(".bars")
    .data(filteredData, d => d['Primary English Name'])
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

// TODO:
// Work out how to display both Long name and colloquial name/Hebrew name?
// Add in colours based on country?
