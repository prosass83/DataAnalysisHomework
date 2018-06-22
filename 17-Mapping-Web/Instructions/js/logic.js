// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function chooseRadius(mag) {
  var radius = (mag-1)*4;
  console.log("Magnitude: " + mag + " Radius: " + radius)
  return radius;
}

function chooseColor(mag) {
  var color = "#000";
  //Coral colors, increasing in intensity
  if (mag <= 3.0 ) {
    console.log("Magnitude > 5")
    color = "#FF7F50";
    }
    else if (mag > 3 && mag <= 4.0){
      console.log("Magnitude <= 5")
      color = "#FF7256";
    }
    else if (mag > 4 && mag <= 5.0){
      console.log("Magnitude <= 5")
      color = "#EE6A50";
    }
    else if (mag > 5 && mag <= 6.0){
      console.log("Magnitude <= 5")
      color = "#CD5B45";
    }
    else if (mag > 6){
      console.log("Magnitude <= 5")
      color = "#8B3E2F";
    }
      
    
  return color;
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      var geojsonMarkerOptions = {
        radius: chooseRadius(feature.properties.mag),
        fillColor: chooseColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and satellitemap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoicHJvc2FzcyIsImEiOiJjamlkdmdsdTcwZnJyM2x0NGZ2d2tnM2V0In0." +
  "lYdBMOj5aNZMNggd2U2BuA");

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoicHJvc2FzcyIsImEiOiJjamlkdmdsdTcwZnJyM2x0NGZ2d2tnM2V0In0." +
  "lYdBMOj5aNZMNggd2U2BuA");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      30, 0
    ],
    zoom: 3,
    layers: [satellitemap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
