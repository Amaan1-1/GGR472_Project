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

let pointgeojson;

map.on('load', () => {
    console.log('Map fully loaded');
    fetch('./data/green_spaces.geojson')
        .then(response => response.json())
        .then(data => {
            map.addSource('points', { type: 'geojson', data });
            map.addLayer({
                id: 'points-layer',
                type: 'circle',
                source: 'points',
                paint: {
                    'circle-radius': 6,
                    'circle-color': '#cafa08'
                }
            });
        });
});