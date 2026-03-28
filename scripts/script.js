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
    const icons = [
        { name: 'tree-icon', url: './data/tree-fill.svg' },
        { name: 'house-icon', url: './data/house-fill.svg' },
        { name: 'signpost-icon', url: './data/signpost-2-fill.svg' }
        ];
  fetch('./data/green_spaces.geojson')
    .then(response => response.json())
      .then(data => {
        green_spaces = data;
        map.addImage("bi bi-tree-fill", image)
        map.addSource('green-spaces', {
            type: 'geojson',
            data: green_spaces
        });
        map.addLayer({
            id: 'green-spaces-layer',
            type: 'symbol',
            source: 'green-spaces',
            layout: {
            'icon-image': "bi bi-tree-fill",
            'icon-size': 0.5
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