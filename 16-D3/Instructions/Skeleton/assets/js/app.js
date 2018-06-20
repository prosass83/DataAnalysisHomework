// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 60,
  left: 45
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("assets/csv/data.csv", function(error, healthData) {

  // Log an error if one exists
  if (error) return console.warn(error);

  // Print the tvData
  console.log(healthData);

  // Cast the health and poverty values to a number for each piece of healthData
  healthData.forEach(function(d) {
    d.health = +d.health;
    d.poverty = +d.poverty;
    //console.log(d.health)
    console.log(d.abbr)
  });
  
  // scale y to chart height
  var yScale = d3.scaleLinear()
  .domain([0, d3.max(healthData, d => d.health)])
  .range([chartHeight, 0]);

  // scale x to chart width
  var xScale = d3.scaleLinear()
  .domain([0, d3.max(healthData, d => d.poverty)])
  .range([0, chartWidth]);

  
  
  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xScale).ticks(8);
  var leftAxis = d3.axisLeft(yScale);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  svg.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.health))
    .attr("r", 20)
    .attr("fill", "#00aa88")
    .attr("opacity", ".5");

  //Seems to be only adding some states, not all 
  svg.selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.health))
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "white")
    .attr("opacity", ".75");

    chartGroup.append("text")
    .attr("y",chartHeight + 20)
    .attr("x",chartWidth / 2)
    .attr("dy", "1em")
    .attr("font-weight", "bold")
    .style("text-anchor", "middle")
    .classed("axis-text", true)
    .text("In Poverty (%)");

    // append y axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("font-weight", "bold")
    .style("text-anchor", "middle")
    .classed("axis-text", true)
    .text("Lacks Healtcare (%)");


});

