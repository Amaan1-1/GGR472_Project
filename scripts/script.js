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

let greenSpaces;

fetch('https://raw.githubusercontent.com/ktandory/Lab4/refs/heads/main/data/pedcyc_collision_06-21.geojson')
    .then(response => response.json())
    .then(response => {
        console.log(response); //Check response in console
        collisionData = response; //Store geojson as variable using URL from fetch response
    })