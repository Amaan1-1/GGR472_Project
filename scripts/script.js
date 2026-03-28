let token = '__MAPBOX_TOKEN__';
let style = '__MAPBOX_STYLE__';

// If the local config file was successfully loaded, override the placeholders
if (typeof MAPBOX_CONFIG !== 'undefined') {
    token = MAPBOX_CONFIG.token;
    style = MAPBOX_CONFIG.style;
}

// Define access token
mapboxgl.accessToken = token;
// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', // container id in HTML
    style: style,  // added map style here
    center: [-79.39, 43.65],  // starting point, longitude/latitude
    zoom: 11 // starting zoom level
});

let green_spaces;

let green_roofs;

let green_streets;

map.on('load', () => {
  fetch('./data/green_spaces.geojson')
    .then(response => response.json())
    .then(data => {
        green_spaces = data;
        map.addSource('green-spaces', {
            type: 'geojson',
            data: green_spaces
        });
        map.addLayer({
            id: 'green-spaces-layer',
            type: 'circle',
            source: 'green-spaces',
            paint: {
            'circle-radius': 6,
            'circle-color': '#cafa08'
            }
      });       
    });

    fetch('https://raw.githubusercontent.com/Amaan1-1/GGR472_Project/refs/heads/main/data/green_roofs.geojson')
    .then(response => response.json())
    .then(data => {
        green_roofs = data;
        map.addSource('green-roofs', {
            type: 'geojson',
            data: green_roofs
        });
        map.addLayer({
            id: 'green-roofs-layer',
            type: 'circle',
            source: 'green-roofs',
            paint: {
            'circle-radius': 6,
            'circle-color': '#fa08d2'
            }
      });       
    });
    fetch('https://raw.githubusercontent.com/Amaan1-1/GGR472_Project/refs/heads/main/data/green_streets.geojson')
    .then(response => response.json())
    .then(data => {
        green_streets = data;
        map.addSource('green-streets', {
            type: 'geojson',
            data: green_streets
        });
        map.addLayer({
            id: 'green-streets-layer',
            type: 'circle',
            source: 'green-streets',
            paint: {
            'circle-radius': 6,
            'circle-color': '#0808fa'
            }
      });       
    });
}); 