function addPopup(map, layerId){
    // Open popup when user clicks on a hex
    map.on('click', layerId, (e) => {
        console.log(e.features[0].properties["Common Name"]);

        // Show popup with collision count and hex area on click
        if(layerId === "green-streets-layer"){
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML("<b>Area Name:</b> " + e.features[0].properties["Common Name"] +
                "<br><b>Green Infrastructure Type:</b> " + e.features[0].properties["Green Infrastructure Type"]
                + "<br><br><button id='add-buffer-btn' type='button'>Add Buffer</button>"
                )
                .addTo(map);
        }
        else if(layerId === "green-roofs-layer"){
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML("<b>Building Type:</b> " + e.features[0].properties.PERMIT_TYP +
                "<br><b>Address:</b> " + e.features[0].properties.FULL_ADDRE
                + "<br><br><button id='add-buffer-btn' type='button'>Add Buffer</button>"
                )
                .addTo(map);
        }
        else if(layerId === "green-spaces-layer"){
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML("<b>Area Name:</b> " + e.features[0].properties.AREA_NAME + "<br><br><button id='add-buffer-btn' type='button'>Add Buffer</button>")
                .addTo(map);
        } 

        if(document.getElementById('add-buffer-btn')){
                Buffer("add-buffer-btn", e.lngLat.lng, e.lngLat.lat);
            }
           
    });
   

    // Change cursor style when hovering over a clickable feature
    map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Reset cursor when leaving the feature
    map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(layerId, 'fill-opacity', 0.6);
    });

    // Add a hover effect by increasing opacity of all hexagons
    map.on('mousemove', layerId, () => {
        map.setPaintProperty(layerId, 'fill-opacity', 0.9);
    });
       
}


//Goes back to original map view when reset button is clicked
function resetButton(map, button){
    document.getElementById(button).addEventListener('click', () => {
        map.flyTo({
            center: [-79.39, 43.65],
            zoom: 11,
            essential: true,
            bearing: 0,
            pitch: 0
        });
    });

}

function UpdateVisibility(buttonId, label, map, LayerName){
    document.getElementById(buttonId).addEventListener('click', () => {
        const visibility = map.getLayoutProperty(label, 'visibility');
        const outlineId = label + '-outline';

        if (visibility !== "none") {
            map.setLayoutProperty(label, 'visibility', 'none');

            if (map.getLayer(outlineId)) {
                map.setLayoutProperty(outlineId, 'visibility', 'none');
            }

            document.getElementById(buttonId).innerHTML = LayerName + " (Show)";
        }
        else {
            map.setLayoutProperty(label, 'visibility', 'visible');

            if (map.getLayer(outlineId)) {
                map.setLayoutProperty(outlineId, 'visibility', 'visible');
            }

            document.getElementById(buttonId).innerHTML = LayerName + " (Hide)";
        }
    });
}

//Source https://docs.mapbox.com/mapbox-gl-js/example/mouse-position/
//Show long and lat of mouse
function LatLngDisplay(map) {

    map.on('mousemove', (e) => {
        let coords = e.lngLat.wrap();  
        // Use turf.round to round coordinates to 3 decimal places
        const lng = turf.round(coords.lng, 3);
        const lat = turf.round(coords.lat, 3);

        document.getElementById('coordinate-display').innerHTML = "Longitude: " + lng + " | Latitude: " + lat;
    });
}

//Create a geojson to sore the 2 points
let geojson = {
    'type': 'FeatureCollection',
    'features': []
};

//From start, have the buttons waiting to be clicked
//Not just selecting whenever someone clicks on map
setPoint("point1", 0, map);
setPoint("point2", 1, map);

function setPoint(button, point, map){
    // Listen for the button click to start the point selection
    document.getElementById(button).addEventListener('click', () => {
        // // Using map.once to capture only the next single click on the map
        map.once('click', (e) => {
            // creating a new GeoJSON Feature object to store the coordinates of the user's click
            const clickedpoint = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [e.lngLat.lng, e.lngLat.lat] // Access map coords of mouse click
                }
            };
            // Assign the new feature to a specific index like geojson.features[0] for point 1, geojson.features[1] for point 2
            geojson.features[point] = clickedpoint;
            // Refresh the map source to display the newly placed point
            map.getSource('input-data').setData(geojson);
            // Trigger distance calculation now that a point has been updated
            getDistance();
        });
    });
}

function getDistance(){
    // Only run if both points have been set
    if(geojson.features[0] && geojson.features[1]){
        //compute distance
        let distance = turf.distance(geojson.features[0], geojson.features[1], 'kilometers');
        // Update the HTML display with the result which is rounded to 3 decimal places
        document.getElementById('distance-output').innerHTML = turf.round(distance, 3);

        //create the linestring between 2 points
        geojson.features[2] = {
            'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        geojson.features[0].geometry.coordinates,
                        geojson.features[1].geometry.coordinates
                    ]
                }
            };

        // Update the map source to draw the connection line
        map.getSource('input-data').setData(geojson);
    }

}

function fetchData(path, sourceId, layerId, icon, size) {
    fetch(path)
        .then(response => response.json())
        .then(data => {

            map.addSource(sourceId, {
                type: 'geojson',
                data: data
            });

            if (layerId === 'green-spaces-layer') {
                map.addLayer({
                    id: layerId,
                    type: 'fill',
                    source: sourceId,
                    paint: {
                        'fill-color': '#00aa55',
                        'fill-opacity': 0.5
                    }
                });

                map.addLayer({
                    id: layerId + '-outline',
                    type: 'line',
                    source: sourceId,
                    paint: {
                        'line-color': '#006633',
                        'line-width': 1
                    }
                });
            }

            else if(layerId === 'heat-vulnerability-layer') {
                map.addLayer({
                    id: layerId,
                    type: 'fill',
                    source: sourceId,
                    paint: {
                        'fill-color': [
                            'step',
                            ['get', 'vuln_pc2'],
                            '#ffff00',
                            -2.503528, '#ffb000',
                            -0.852801, '#ff7f00',
                            0.497898, '#ff3f00',
                            2.020020, '#ff0000'
                            ],
                        'fill-opacity': 0.7
                    }
                });

                map.addLayer({
                    id: layerId + '-outline',
                    type: 'line',
                    source: sourceId,
                    paint: {
                        'line-color': '#660000',
                        'line-width': 0.8
                    }
                });
            }

            else {
                map.addLayer({
                    id: layerId,
                    type: 'symbol',
                    source: sourceId,
                    layout: {
                        'icon-image': icon,
                        'icon-size': size
                    }
                });
                map.moveLayer(layerId);
            }
            reorderLayers(map);
        });
    
}

//src: https://docs.mapbox.com/mapbox-gl-js/api/map/#:~:text=getCanvas().toDataURL()%20.%20This%20is%20false%20by%20default%20as%20a%20performance&text=To%20load%20a%20style%20from%20the%20Mapbox,use%20a%20URL%20of%20the%20form%20mapbox
function ExportMap(map){
    const canvas = map.getCanvas().toDataURL('image/png');
   
}

function reorderLayers(map){
    const order = [
        'heat-vulnerability-layer',
        'heat-vulnerability-layer-outline',
        'green-spaces-layer',
        'green-spaces-layer-outline',
        'green-roofs-layer',
        'green-streets-layer'
    ];

    order.forEach(layer => {
        if (map.getLayer(layer)) {
            map.moveLayer(layer);
        }
    });
}

function addIntensityFilter(map, selectId, layerId) {
    document.getElementById(selectId).addEventListener('change', (e) => {
        const value = e.target.value;
        let filter = null;

        const vuln = ['get', 'vuln_pc2'];

        if(value === 'high'){
            filter = ['>=', vuln, 4.8];
        } 
        else if (value === 'moderate-high') {
            filter = ['all',
                ['>=', vuln, 1.6],
                ['<', vuln, 4.8]
            ];
        } 
        else if(value === 'moderate') {
            filter = ['all',
                ['>=', vuln, -1.6],
                ['<', vuln, 1.6]
            ];
        }
        else if (value === 'low-moderate') {
            filter = ['all',
                ['>=', vuln, -4.8],
                ['<', vuln, -1.6]
            ];
        } 
        else if (value === 'low') {
            filter = ['<', vuln, -4.8];
        }

        map.setFilter(layerId, filter);

        if (map.getLayer(layerId + '-outline')) {
            map.setFilter(layerId + '-outline', filter);
        }
    });
}

function ClearPoints(){
    geojson["features"] = [];
    map.getSource('input-data').setData(geojson);
    document.getElementById('distance-output').innerHTML = "0";
}

function Buffer(btnId, long, lat){
    //wait for the user to click a point on the map then create a buffer at that point
    document.getElementById(btnId).addEventListener('click', () => { 
        map.once('click', (e) => {
            let distance = document.getElementById('buffer-dist');
            let point = turf.point([long, lat]);
            if(!long && !lat){
                point = turf.point([e.lngLat.lng, e.lngLat.lat]);
            }
            let buffresult = turf.buffer(point, distance.value/1000);

            map.addSource('buffgeojson', {
                "type": "geojson",
                "data": buffresult 
            });

            map.addLayer({
                "id": "inputpointbuff",
                "type": "fill",
                "source": "buffgeojson",
                "paint": {
                    'fill-color': "white",
                    'fill-opacity': 0.5,
                    'fill-outline-color': "black"
                }
            });

        });
    });
}

function clearBuffer(){

    if(map.getLayer('inputpointbuff')){
        map.removeLayer('inputpointbuff');
    }

    if(map.getSource('buffgeojson')){
        map.removeSource('buffgeojson');
    }
}

