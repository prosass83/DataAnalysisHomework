// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Perform a GET request to the query URL
d3.json(queryUrl, function(earthquakeData) {
  // Once we get a response, send the data.features object to the createFeatures function
  d3.json(tectonicUrl, function(tectonicData) {
    createFeatures(earthquakeData.features, tectonicData.features);
  });
});

function chooseRadius(mag) {
  var radius = (mag-1)*4;
  //console.log("Magnitude: " + mag + " Radius: " + radius)
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

function createFeatures(earthquakeData, tectonicData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    console.log("Creating PopUp")
    console.log("Magnitude: " +  feature.properties.mag + " Place: " +  feature.properties.place)
    layer.bindPopup("<h3>" + feature.properties.mag +
      "</h3><hr><p>" + feature.properties.place + "</p>");
  }

  // Create the GeoJSON layer containing the features array on the earthquakeData object
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

  //Create second GeoJson layer with tectonic plates
  var poligonStyle = {
    "weight": 5,
    "color": "#0404B4"
};

  var tectonicPlates = L.geoJSON(tectonicData, {
    style: poligonStyle
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, tectonicPlates);
}

function createMap(earthquakes, tectonicPlates) {

  // Define streetmap and satellitemap layers
  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoicHJvc2FzcyIsImEiOiJjamlkdmdsdTcwZnJyM2x0NGZ2d2tnM2V0In0." +
  "lYdBMOj5aNZMNggd2U2BuA");

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoicHJvc2FzcyIsImEiOiJjamlkdmdsdTcwZnJyM2x0NGZ2d2tnM2V0In0." +
  "lYdBMOj5aNZMNggd2U2BuA");

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoicHJvc2FzcyIsImEiOiJjamlkdmdsdTcwZnJyM2x0NGZ2d2tnM2V0In0." +
  "lYdBMOj5aNZMNggd2U2BuA");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Outdoor Map": outdoormap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    TectonicPlates: tectonicPlates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      30, 0
    ],
    zoom: 3,
    layers: [satellitemap, earthquakes, tectonicPlates]
  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  
// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};

// Add the info legend to the map
info.addTo(myMap);

// I had to move this section after adding info to the map, otherwise the div 
//legend had not been created by the time this section is executed
document.querySelector(".legend").innerHTML = [
  "<p class='lower-than-three'><span></span> 0-3 </p>",
  "<p class='three-four'><span></span> 3-4 </p>",
  "<p class='four-five'><span></span> 4-5 </p>",
  "<p class='five-six'><span></span> 5-6 </p>",
  "<p class='higher-than-six'><span></span> 6+ </p>"
].join("");


}
