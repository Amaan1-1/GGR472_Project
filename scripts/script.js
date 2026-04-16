mapboxgl.accessToken = 'pk.eyJ1Ijoia3RhbmRvcnkiLCJhIjoiY21rYmZhc2dqMDNqNzNlcHkwM2Z3cnAwMiJ9.GPIGSEiM53gRImZ-15RKkg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ktandory/cmmurs2ae004x01rx8zujb0kp',
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
            path: './data/green_roofs.geojson',
            source: 'green-roofs',
            layer: 'green-roofs-layer',
            icon: 'house-icon',
            size: 0.025,
            btn: 'btn-roofs',
            label: 'Green Roofs'
        },
        
        {
            path: './data/green_spaces.geojson',
            source: 'green-spaces',
            layer: 'green-spaces-layer',
            icon: 'Undefined',
            size: 0.08,
            btn: 'btn-spaces',
            label: 'Green Spaces'
        },
        
        {
            path: './data/green_streets.geojson',
            source: 'green-streets',
            layer: 'green-streets-layer',
            icon: 'signpost-icon',
            size: 0.12,
            btn: 'btn-streets',
            label: 'Green Streets'
        },
        {
            path: './data/heat_vulnerability_map.geojson',
            source: 'heat-vulnerability',
            layer: 'heat-vulnerability-layer',
            icon: 'Undefined',
            size: 0.1,
            btn: 'btn-heat',
            label: 'Heat Vulnerability'
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

    if (document.getElementById('intensity-filter')) {
        addIntensityFilter(map, 'intensity-filter', 'heat-vulnerability-layer');
    }

    // Add a source for user-inputted points and lines
    map.addSource('input-data', {
        type: 'geojson',
        data: geojson
    });

    // Add a layer to visualize the points the user clicks on the map
    map.addLayer({
        'id': 'input-pnts',
        'type': 'circle',
        'source': 'input-data',
        'paint': {
            'circle-radius': 5,
            'circle-color':"#2dff03",
            'circle-stroke-width': 1.5, // white outline
            'circle-emissive-strength': 1.1, //glow effect
            'circle-stroke-color': '#ffffff' //white stroke
        }
    });

    //Create a line between the 2 points
    //Source: https://docs.mapbox.com/mapbox-gl-js/example/geojson-line/
    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'input-data',
        'layout': {
            'line-cap': 'round', // Rounded corners
            'line-join': 'round'
        },
        'paint': {
            'line-color':"#000000",
            'line-width': 8, // Thick line
            'line-opacity': 1.0 // Full opacity for max visibility
        },
    });

    if(document.getElementById('point1')){
        setPoint("point1", 0, map);
        setPoint("point2", 1, map);
    }

    document.getElementById('clear-points').addEventListener('click', () => {
        ClearPoints();
    });

    if(document.getElementById('btn-buffer')){
        Buffer("btn-buffer", null, null);
    }

    document.getElementById('clear-buffer').addEventListener('click', () => {
        clearBuffer();
    });


});