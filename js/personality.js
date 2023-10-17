const MARGIN = { LEFT: 100, RIGHT: 50, TOP: 70, BOTTOM: 50 };
const WIDTH = 1618 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 1000 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .attr('viewBox', [
    0,
    0,
    WIDTH + MARGIN.LEFT + MARGIN.RIGHT,
    HEIGHT + MARGIN.TOP + MARGIN.BOTTOM,
  ])
  .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

const g = svg
  .append('g')
  .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

const format = d3
  .formatLocale({
    decimal: '.',
    thousands: ',',
    grouping: [3],
    currency: ['£', ''],
  })
  .format('$,d');

const color = d3.scaleOrdinal().range(
  d3.schemeCategory10.map((c) => {
    c = d3.rgb(c);
    c.opacity = 0.6;
    return c;
  }),
);

const nest = d3
  .nest()
  .key((d) => d.Seder)
  .key((d) => d.Masechet)
  .rollup((d) => d3.sum(d, (d) => d.adjusted_count));

const treemap = d3.treemap().size([WIDTH, HEIGHT]).padding(1).round(true);

function type(d) {
  d.adjusted_count = +d.adjusted_count;
  return d;
}

// create a tooltip
const Tooltip = d3
  .select('#chart-area')
  .append('div')
  .style('opacity', 0)
  .attr('class', 'tooltip')
  .style('background-color', 'white')
  .style('border', 'solid')
  .style('border-width', '2px')
  .style('border-radius', '5px')
  .style('padding', '5px');

// Three function that change the tooltip when user hover / move / leave a cell
const mouseover = function (d) {
  Tooltip.style('opacity', 1);
  d3.select(this).style('stroke', 'black').style('opacity', 1);
};
const mousemove = function (d) {
  Tooltip.html(`Frequency Rating: ${Math.round(d.value)}`)
    .style('left', `${d3.mouse(this)[0] + 300}px`)
    .style('top', `${d3.mouse(this)[1]}px`);
};
const mouseleave = function (d) {
  Tooltip.style('opacity', 0);
  d3.select(this).style('stroke', 'none').style('opacity', 0.8);
};

d3.csv('data/abaye_treemap_adjusted.csv', type, (error, data) => {
  if (error) throw error;

  const root = d3
    .hierarchy({ values: nest.entries(data) }, (d) => d.values)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  treemap(root);

  svg
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('x', (d) => `${d.x0}px`)
    .attr('y', (d) => `${d.y0}px`)
    .attr('width', (d) => `${d.x1 - d.x0}px`)
    .attr('height', (d) => `${d.y1 - d.y0}px`)
    .style('fill', (d) => color(d.parent.data.key))
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);

  // node.append("div")
  //     .attr("class", "node-label")
  //     .text(function(d) { return d.data.key + "\n" + d.parent.data.key; });

  // node.append("div")
  //     .attr("class", "node-value")
  //     .text(function(d) { return Math.round(d.value); });

  // and to add the text labels
  svg
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
    .attr('x', (d) => d.x0 + 10) // +10 to adjust position (more right)
    .attr('y', (d) => d.y0 + 20) // +20 to adjust position (lower)
    .text((d) => d.data.key)
    .attr('font-size', '15px')
    .attr('fill', 'white');
});
