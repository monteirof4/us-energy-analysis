function optionChanged(sel) {
  // Fetch new data each time a new sample is selected
  d3.select("#totalRenewableEnergyGraph").html("");
  var newMetric = sel.options[sel.selectedIndex].value;
  var newText = sel.options[sel.selectedIndex].text;
  barchart(newMetric, newText);
};

// Initialize the dashboard
barchart("Total_co2_emission", "Total CO2 Emission");

function barchart(metric, text){
d3.json(`/energy_data_metric/${metric}`, function (error, data) {
  if (error) return console.error(error);
  // Coerce data values to be numeric
  data.forEach(function (d) {
    d3.keys(d).forEach(function (k) {
      if (k !== "State") {
        d[k] = +d[k]

      }

    })
  });

  visualization = d3plus.viz()
    .container("#totalRenewableEnergyGraph")
    .data(data)
    .type("bar")
    .id("State")
    .x({
      value: "State",
      grid: true
    })
    .y(metric)
    .color({
      value: metric
    })
    .height(400)
    .width(800)
    .title(text)
    .legend({ "value": true })
    .legend({ "size": 50 })
    // .footer({
    //   "link": "https://www.eia.gov/environment/emissions/ghg_report/ghg_carbon.php",
    //   "value": "Total carbon dioxide emissions"
    // })
    .ui([
      {
        "method": "color",
        "value": [{ "Random": "State" }, { "Weight Value": `${metric}` }]
      }
    ])
    .draw()
});
}