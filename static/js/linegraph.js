function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/states").then((States) => {
      States.forEach((state) => {
        selector
          .append("option")
          .text(state)
          .property("value", state);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstState = States[0];
      buildPriceChart(firstState);
      buildEmissionChart(firstState);
    });
  }

  function buildPriceChart(state) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/energy_data/${state}`;
    d3.json(url).then((states) => {
      // @TODO: Build a Bubble Chart using the sample data
    var x = states.map(state => parseFloat(state.Year));
    var y = states.map(state => parseFloat(state.Average_Price));
    
    var lineData = {
        x: x,
        y: y,
        mode: 'lines',
        line: {
            color: 'rgb(55, 128, 191)',
            width: 3
        }
      };
      
      var data = [lineData];

      var layout = {
        title: `Electricity Average Price: ${state}`,
        xaxis: {
            title: 'Year'
          },
          yaxis: {
            title: 'Electricity Average Price (US$ per million Btu)',
            titlefont: {
                size : 10
            }
          }
      };
      
      Plotly.newPlot('priceGraph', data, layout);
  
    });
  }; 

  function buildEmissionChart(state) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/energy_data/${state}`;
    d3.json(url).then((states) => {
      // @TODO: Build a Bubble Chart using the sample data
    var x = states.map(state => parseFloat(state.Year));
    var y = states.map(state => parseFloat(state.Total_co2_emission));
    
    var lineData = {
        x: x,
        y: y,
        mode: 'lines',
        line: {
            color: 'rgb(55, 128, 191)',
            width: 3
        }
      };
      
      var data = [lineData];

      var layout = {
        title: `CO2 Emission ${state}`,
        xaxis: {
            title: 'Year'
          },
          yaxis: {
            title: 'CO2 Emission (million metric tons)',
            titlefont: {
                size : 10
            }
          }
      };
      
      Plotly.newPlot('emissionGraph', data, layout);
  
    });
  };  

  function optionChanged(newState) {
    // Fetch new data each time a new sample is selected
    buildPriceChart(newState);
    buildEmissionChart(newState);
  }
  
  // Initialize the dashboard
  init();