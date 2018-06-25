// Store our API endpoint inside queryUrl
var queryUrl = "assets/dataJobs.json";

// Perform a GET request to the query URL
d3.json(queryUrl, function(jobsData) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(jobsData.features);
});

//function chooseRadius(mag) {
//  var radius = (mag-1)*4;
  //console.log("Magnitude: " + mag + " Radius: " + radius)
  //return radius;
//}

function createFeatures(jobsData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the company name and the city where the job is located
  function onEachFeature(feature, layer) {
    console.log("Creating PopUp")
    console.log("Company: " +  feature.properties.company + " City: " +  feature.properties.city + " Coordinates: " + feature.geometry.coordinates)
    layer.bindPopup("<h3>" + feature.properties.company  +
    "</h3><hr><p>" + feature.geometry.coordinates + "</p>");
  }

  // Create the GeoJSON layer containing the features array on the jobsData object
  // Run the onEachFeature function once for each piece of data in the array
  var jobs = L.geoJSON(jobsData, {
    pointToLayer: function (feature, latlng) {
      var geojsonMarkerOptions = {
        //radius: chooseRadius(feature.properties.mag),
        radius: 20,
        //fillColor: chooseColor(feature.properties.mag),
        fillColor: "#8B3E2F",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      console.log("Plotting markers")
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature
  });

  // Sending our jobs layer to the createMap function
  createMap(jobs);
}

function createMap(jobs) {

  // Define streetmap and satellitemap layers
  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoicHJvc2FzcyIsImEiOiJjamlkdmdsdTcwZnJyM2x0NGZ2d2tnM2V0In0." +
  "lYdBMOj5aNZMNggd2U2BuA");

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoicHJvc2FzcyIsImEiOiJjamlkdmdsdTcwZnJyM2x0NGZ2d2tnM2V0In0." +
  "lYdBMOj5aNZMNggd2U2BuA");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Outdoor Map": outdoormap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Jobs: jobs
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, jobs]
  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


}
