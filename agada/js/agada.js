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
  
  // Parse the Data
  d3.csv("data/agada_halacha.csv").then( function(data) {

    // event listeners
    // $("#seder-select").on("change", update)
    
  // X axis
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(d => d.Masechet))
    .padding(0.2);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize([0]))
    .style("color","#464655ff")
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("color","#464655ff")
      .attr("font-family", "Calibri")
      ;
  
  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
  svg.append("g")
    // .call(d3.axisLeft(y))
    // .style("color","#464655ff");
  
  // Bars
  svg.selectAll("mybar")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.Masechet))
      .attr("y", d => y(d.percent_aggada))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.percent_aggada))
      .attr("fill", "#ffadad");
  
  // Add a 50% referrence line
  // const line = d3.line()([[x('Arakhin') + 60, y(40)], [x('Taanit') + 74, y(40)]])
  // console.log("line",line)

  d3.select("svg")
      .append("path")
      .attr("d", line)
      .attr("stroke", "#464655ff")
      .style("opacity", 0.5);
  
  })

  //TODO: Add update function based on event listner
  // Add filter to data