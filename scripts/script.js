let token = '__MAPBOX_TOKEN__';
let style = '__MAPBOX_STYLE__';

if (typeof MAPBOX_CONFIG !== 'undefined') {
    token = MAPBOX_CONFIG.token;
    style = MAPBOX_CONFIG.style;
}

mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map',
    style: style,
    center: [-79.39, 43.65],
    zoom: 11,
    preserveDrawingBuffer: true
});

map.on('load', () => {
    const icons = [
        { name: 'tree-icon', url: './data/tree.png' },
        { name: 'house-icon', url: './data/house.png' },
        { name: 'signpost-icon', url: './data/signpost.png' }
    ];

    const layers = [
        {
            path: './data/green_spaces.geojson',
            source: 'green-spaces',
            layer: 'green-spaces-layer',
            icon: 'tree-icon',
            size: 0.08,
            btn: 'btn-spaces',
            label: 'Green Spaces'
        },
        {
            path: './data/green_roofs.geojson',
            source: 'green-roofs',
            layer: 'green-roofs-layer',
            icon: 'house-icon',
            size: 0.08,
            btn: 'btn-roofs',
            label: 'Green Roofs'
        },
        {
            path: './data/green_streets.geojson',
            source: 'green-streets',
            layer: 'green-streets-layer',
            icon: 'signpost-icon',
            size: 0.08,
            btn: 'btn-streets',
            label: 'Green Streets'
        }
    ];

    let loadedCount = 0;

    icons.forEach(icon => {
        map.loadImage(icon.url, (error, image) => {
            if(error){
                return;
            }
            map.addImage(icon.name, image);
            loadedCount++;

            if (loadedCount === icons.length) {
                layers.forEach(item => {
                    fetchData(item.path, item.source, item.layer, item.icon, item.size);
                    addPopup(map, item.layer);
                    console.log()
                    UpdateVisibility(item.btn, item.layer, map, item.label);
                });
            }
        });
    });

    // Initialize Geocoder
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Search for a location'
    });
    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    // Call reset functionality 
    resetButton(map, 'reset-btn');

    if (document.getElementById('coordinate-display')) {
        LatLngDisplay(map);
    }

});