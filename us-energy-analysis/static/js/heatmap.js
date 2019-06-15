API_KEY = "pk.eyJ1IjoiZmVuZ2h1IiwiYSI6ImNqd2I4YWhtMjBieGs0OHFtODhvbzd2cHIifQ._ISMNET1wgWZDzZrYWIqTQ";
  
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

// Total CO2 Emission
var totalCo2 = new L.LayerGroup();
d3.json("/states").then((datastate) => {
    d3.json("/energy_data_year/2016").then((data2016) => {
 
        var lat = datastate.map(state => parseFloat(state.Latitude));
        var lon = datastate.map(state => parseFloat(state.Longitude));

        var co2 = data2016.map(row => parseFloat(row.Total_co2_emission));
        var price = data2016.map(row => parseFloat(row.Average_Price));
        var population = data2016.map(row => parseFloat(row.Average_resident_population));


        for (i = 1; i < datastate.length; i++){

            Location = [lat[i], lon[i]];
            var us_ab = datastate[i].Abbreviation;

            var dColor = "";
            var r = 0;
            if (co2[i] < 50) {
              dColor = "green";
              r = 4;
            }
            else if (co2[i] < 100 ) {
              dColor = "lightgreen";
              r = 7;
            }
            else if (co2[i]< 200 ) {
              dColor = "orange";
              r = 10;
            }
            else if (co2[i] < 500 ) {
              dColor = "red";
              r =13;
            }
            else {
              dColor = "brown";
              r =16;
            }


            L.circle(Location,{
                fillOpacity: 0.7,
                color: dColor,
                fillColor: dColor,
                weight : 1,
                radius: r*10000
            }).bindPopup("<h3>" + us_ab + " 2016 </h3> <hr> <h5>Total Co2 Emission: " + co2[i]+
            " million metric tons CO2 </h5> <br> <h5>Resident Population: " + population[i] + 
            " Thousand </h5> <br> <h5> Total Energy Average Price: "+ price[i]+" Dollars per million Btu </h5>").addTo(totalCo2)

        }

        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend");
          var limits = ["0-50","50-100","100-200","200-500","500+"];
          var colors = ["green","lightgreen","orange","red","brown"];
          var labels = [];

          var legendInfo = "<p2>Total Co2 Emission</p2>"
          div.innerHTML = legendInfo;
      
          limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] +"\"> " + limit + "</li>");
          });
      
          div.innerHTML += "<ul>" + labels.join("") + "</ul>";
          return div;
        };
      
        // Adding legend to the map
        legend.addTo(myMap);

    });
});


// Total Production Energy
var totalProductionEnergy = new L.LayerGroup();
d3.json("/states").then((datastate) => {
    d3.json("/energy_data_year/2016").then((data2016) => {
 
        var lat = datastate.map(state => parseFloat(state.Latitude));
        var lon = datastate.map(state => parseFloat(state.Longitude));

        var price = data2016.map(row => parseFloat(row.Average_Price));
        var co2 = data2016.map(row => parseFloat(row.Total_co2_emission));
        var totalEnergy = data2016.map(row => parseFloat(row.Total_energy));
        var renewable = data2016.map(row => parseFloat(row.Total_renewable_energy));

        for (i = 1; i < datastate.length; i++){

            Location = [lat[i], lon[i]];
            var us_ab = datastate[i].Abbreviation;

            var dColor = "";
            var r = 0;
            if (totalEnergy[i] < 100000) {
              dColor = "lightblue";
              r = 4;
            }
            else if (totalEnergy[i] < 1000000 ) {
              dColor = "yellow";
              r = 7;
            }
            else if (totalEnergy[i]< 2000000 ) {
              dColor = "violet";
              r = 10;
            }
            else if (totalEnergy[i] < 5000000 ) {
              dColor = "blue";
              r =13;
            }
            else {
              dColor = "purple";
              r =16;
            }


            L.circle(Location,{
                fillOpacity: 0.7,
                color: dColor,
                fillColor: dColor,
                weight : 1,
                radius: r*10000
            }).bindPopup("<h3>" + us_ab + " 2016 </h3> <hr> <h5>Total Energy Production: " + totalEnergy[i]+
            " Billion Btu </h5> <br> <h5>Total Renewable Energy Production: " + renewable[i] + 
            " Billion Btu </h5> <br> <h5>Total CO2 Emission: " + co2[i] + 
            " million metric tons CO2 </h5> <br> <h5> Total Energy Average Price: "+ price[i]+" Dollars per million Btu </h5>").addTo(totalProductionEnergy)

        }

        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend");
          var limits = ["0-0.1 million","0.1-1 million","1-2 million","2-5 million","5 million+"];
          var colors = ["lightblue","yellow","violet","blue","purple"];
          var labels = [];

          var legendInfo = "<p2>Total Energy Production</p2>"
          div.innerHTML = legendInfo;
      
          limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] +"\"> " + limit + "</li>");
          });
      
          div.innerHTML += "<ul>" + labels.join("") + "</ul>";
          return div;
        };
      
        // Adding legend to the map
        legend.addTo(myMap);

    });
});

// Create an overlay object
var overlayMaps = {
    "Total CO2 Emission": totalCo2,
    "Total Energy Production" : totalProductionEnergy
};

// Define a map object
var myMap = L.map("heatMap", {
    center: [37.0902, -95.7129],
    zoom: 5,
    layers: [lightmap,totalCo2]
  });

L.control.layers(overlayMaps).addTo(myMap);