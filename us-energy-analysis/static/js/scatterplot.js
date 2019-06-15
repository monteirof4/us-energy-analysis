
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".scatterMap")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "Average_Price";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// new circlestext
function renderCirclestext(circletext, newXScale, chosenXAxis) {

  circletext.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return circletext;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "Average_Price") {
    var label = "Average_Price:";
  }
  else if (chosenXAxis === "Average_resident_population")  {
    var label = "Average_resident_population";
  }else {
    var label = "Total_energy";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.State}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>Total_co2_emission: ${d.Total_co2_emission}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data,this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data,this);
    });

  return circlesGroup;
};

// Retrieve data from the CSV file and execute everything below
d3.json("/energy_data_year/2016").then((stateData) => {

  stateData.shift(); //Remove first US

  // parse data
  stateData.forEach(function(data) {
    data.Total_co2_emission = +data.Total_co2_emission;
    data.Average_Price = +data.Average_Price;
    data.Average_resident_population = +data.Average_resident_population;
    data.Total_energy = +data.Total_energy;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.Total_co2_emission)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.Total_co2_emission))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5"); 

  var circletext = chartGroup.selectAll(".stateText")
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.Total_co2_emission-1))
    .text(function(d) {
      return d.State;
    }).classed("stateText",true);
  

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
 
  var priceLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "Average_Price") 
    .classed("active", true)
    .text("Average_Price (Dollars per million Btu)");

  var popLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "Average_resident_population") 
    .classed("inactive", true)
    .text("Average_resident_population (Thousand)"); 

  var energyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "Total_energy") 
    .classed("inactive", true)
    .text("Total_Energy (Billion Btu)"); 

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2)*1.5)
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Total CO2 Emission (million metric tons)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
 
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates circles text with new x values
        circletext = renderCirclestext(circletext, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "Total_energy") {
          energyLabel
            .classed("active", true)
            .classed("inactive", false);
          popLabel
            .classed("active", false)
            .classed("inactive", true);
          priceLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }else if (chosenXAxis === "Average_resident_population"){
          energyLabel
            .classed("active", false)
            .classed("inactive", true);
          popLabel
            .classed("active", true)
            .classed("inactive", false);
          priceLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          energyLabel
            .classed("active", false)
            .classed("inactive", true);
          popLabel
            .classed("active", false)
            .classed("inactive", true);
          priceLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});