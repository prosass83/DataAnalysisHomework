const mapboxToken =
  "pk.eyJ1IjoicHJvc2FzcyIsImEiOiJjamlkdmdsdTcwZnJyM2x0NGZ2d2tnM2V0In0." +
  "lYdBMOj5aNZMNggd2U2BuA";

// perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson", createMarkers);

function createMarkers(response) {
  // pull the "stations" property off of response.data
  var stations = response.data.stations;

  // initialize an array to hold bike markers
  var bikeMarkers = [];

  // loop through the stations array
  for (var index = 0; index < stations.length; index++) {
    var station = stations[index];

    // for each station, create a marker and bind a popup with the station's name
    var bikeMarker = L.marker([station.lat, station.lon]).bindPopup(
      "<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "<h3>"
    );

    // add the marker to the bikeMarkers array
    bikeMarkers.push(bikeMarker);
  }

  // create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(bikeMarkers));
}

function createMap(bikeStations) {
  // create the tile layer that will be the background of our map
  var lightmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=" +
      mapboxToken,
      
    {
      attribution:
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 5
    }
  );

  // create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [0, 0],
    zoom: 3,
    layers: [lightmap, bikeStations]
  });

  // create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false
    })
    .addTo(map);
}
