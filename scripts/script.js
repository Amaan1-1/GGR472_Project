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
        { name: 'tree-icon', url: './data/tree.png' },
        { name: 'house-icon', url: './data/house.png' },
        { name: 'signpost-icon', url: './data/signpost.png' }
        ];
    //src: https://docs.mapbox.com/mapbox-gl-js/example/add-image/
    

    const layers = [
        {
            path: './data/green_spaces.geojson',
            source: 'green-spaces',
            layer: 'green-spaces-layer',
            icon: 'tree-icon',
            size: 0.2
        },
        {
            path: 'https://raw.githubusercontent.com/Amaan1-1/GGR472_Project/refs/heads/main/data/green_roofs.geojson',
            source: 'green-roofs',
            layer: 'green-roofs-layer',
            icon: 'house-icon',
            size: 0.2
        },
        {
            path: './data/green_streets.geojson',
            source: 'green-streets',
            layer: 'green-streets-layer',
            icon: 'signpost-icon',
            size: 0.2
        }
    ];

    let loadedCount = 0;

    icons.forEach(icon => {
    console.log('⏳ Attempting to load image:', icon.name, icon.url);

    map.loadImage(icon.url, (error, image) => {

        console.log('📥 loadImage callback triggered for:', icon.name);

        if (error) {
            console.log('❌ ERROR loading image:', icon.name, error);
            return;
        }

        console.log('✅ Image loaded successfully:', icon.name);
        console.log('🖼️ Image object:', image);

        map.addImage(icon.name, image);
        console.log('📌 Image added to map with name:', icon.name);

        loadedCount++;
        console.log('🔢 Loaded count:', loadedCount, '/', icons.length);

        if (loadedCount === icons.length) {
            console.log('🚀 ALL IMAGES LOADED — NOW LOADING DATA LAYERS');

            layers.forEach(item => {
                console.log('📂 Loading dataset:', item.path);
                console.log('➡️ Source ID:', item.source);
                console.log('➡️ Layer ID:', item.layer);
                console.log('➡️ Icon used:', item.icon);

                fetchData(item.path, item.source, item.layer, item.icon, item.size);
            });
        }
    });
});
});