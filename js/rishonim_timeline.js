const MARGIN = { LEFT: 100, RIGHT: 50, TOP: 70, BOTTOM: 50 }
const WIDTH = 1618 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 1000 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
 

 
d3.csv("data/Rishonim.xlsx").then(data => {

  console.log(data)
});