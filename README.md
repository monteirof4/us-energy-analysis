## Electricity Generation for US Population and Emisson Impact

Data is being gathered from the U.S. Energy Information Administration using their free API.  Database can be queried at the link below.
https://www.eia.gov/opendata/qb.php


Focus is going to be on building charts around the below datasets:
- Electricty Total Average Price

- Energy Production Totals, consist of:
    - Oil
    - Gas
    - Coal
    - Nuclear
    - Renewable Energy Sources

- Renewable Energy Production Totals, consist of:
    - Biomass
    - Hydropower
    - Geothermal
    - Wind
    - Solar
- Resident Populations
- Total CO2 Emissions All Sources

Data is going to be extracted from the API, stored in a SQLite, transformed into various vissualizations, and these visualizations will be easily manipulated on the HTML pages by the user to provide various views of this data. 


Visualizations will be built out using Ploty, Leaflet, heatmap.js, Streamgraph, and Mapbox

https://plot.ly/javascript/
https://leafletjs.com/
https://www.patrick-wied.at/static/heatmapjs/
https://www.d3-graph-gallery.com/streamgraph.html
https://www.mapbox.com/

Examples of charts:
![alt text](https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F8%2F8c%2FLastGraph_example.svg%2F1200px-LastGraph_example.svg.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FStreamgraph&docid=WVH70bQ6FJADKM&tbnid=GGbteHbj07BRTM%3A&vet=10ahUKEwiY0PaNmtbiAhVwn-AKHbKwCxQQMwhsKAAwAA..i&w=1200&h=1127&bih=570&biw=1280&q=stream%20graph&ved=0ahUKEwiY0PaNmtbiAhVwn-AKHbKwCxQQMwhsKAAwAA&iact=mrc&uact=8 "Streamgraph")

![alt text](https://www.google.com/imgres?imgurl=https%3A%2F%2Fmymodernmet.com%2Fwp%2Fwp-content%2Fuploads%2Farchive%2FfB8FbS7sVkhllCe8IYQ4_1065303686.jpeg&imgrefurl=https%3A%2F%2Fmymodernmet.com%2Fregional-musical-preferences-heat-map%2F&docid=6BtGAVPzqZpVcM&tbnid=tnYhSNOjfrs7JM%3A&vet=10ahUKEwjslMuomtbiAhVRMt8KHV-qC_wQMwhxKAIwAg..i&w=685&h=424&bih=570&biw=1280&q=us%20heat%20map&ved=0ahUKEwjslMuomtbiAhVRMt8KHV-qC_wQMwhxKAIwAg&iact=mrc&uact=8 "Heatmap")

![alt text](https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.anychart.com%2Fimages%2Fgallery%2Fv8%2Fline-charts-line-chart.png&imgrefurl=https%3A%2F%2Fwww.anychart.com%2Fproducts%2Fanychart%2Fgallery%2FLine_Charts%2F&docid=Siymmzkk8JgkCM&tbnid=kmMf4vkg1aKgAM%3A&vet=10ahUKEwjHh5K0mtbiAhUiVd8KHY3fB2wQMwiEASgGMAY..i&w=620&h=300&bih=570&biw=1280&q=line%20chart&ved=0ahUKEwjHh5K0mtbiAhUiVd8KHY3fB2wQMwiEASgGMAY&iact=mrc&uact=8 "Line Graph")

