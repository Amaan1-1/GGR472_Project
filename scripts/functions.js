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
                )
                .addTo(map);
        }
        else if(layerId === "green-roofs-layer"){
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML("<b>Building Type:</b> " + e.features[0].properties.PERMIT_TYP +
                "<br><b>Address:</b> " + e.features[0].properties.FULL_ADDRE
                )
                .addTo(map);
        }
        else if(layerId === "green-spaces-layer"){
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML("<b>Area Name:</b> " + e.features[0].properties.AREA_NAME)
                .addTo(map);
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
            essential: true
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
        const lng = coords.lng.toString().slice(0, 6);  
        const lat = coords.lat.toString().slice(0, 5);    
        //source for string slicing: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice

        document.getElementById('coordinate-display').innerHTML = "Longitude: " + lng + " | Latitude: " + lat;
    });
}

function addLegend(map, maxcollisions){
    const legend = document.getElementById('legend');
    if(!legend){
        return;
    } //No legend on analysis page, so dont run function on that page
    legend.innerHTML = '<h4>Collision Intensity</h4>';

    // Create legend for collision categories with matching colors
    const legenditems = [
        { label: "0 collisions", colour: "#ffffff" },
        { label: "1 - 5 collisions", colour: "#ffebf1" },
        { label: "6 - 15 collisions", colour: "#ffb7ce" },
        { label: "16 - 30 collisions", colour: "#ff2163" },
        { label: "31 - " + maxcollisions + " collisions", colour: "#ff0000" }
    ];


    // For each array item create a row to put the label and colour in
    legenditems.forEach(({ label, colour }) => {

        // Create a container row for the legend item
        const row = document.createElement('div');
        // create span for colour circle
        const colcircle = document.createElement('span');

        // the colcircle will take on the shape and style properties defined in css
        colcircle.className = 'legend-colcircle';
        // a custom property is used to take the colour from the array and apply it to the css class
        colcircle.style.setProperty('--legendcolour', colour);

        // Create span element for legend label text
        const text = document.createElement('span');
        text.textContent = label; // set text variable to tlegend label value in array

        // Append each legend item (circle, text) to the container
        row.append(colcircle, text);
        legend.appendChild(row); // Add row into main legend container
    });

    // Create an interactive button for toggling hex visibility
    const button = document.createElement("button");
    button.textContent = "Hide";
    button.id = "hex-toggle";
    button.className = "hide_button";
    legend.appendChild(button);
    //add toggle button functionality using UpdateVisibility method
    UpdateVisibility(button.id, "collishexfill", map);


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
                            ['to-number', ['get', 'SUM_temper']],
                            '#ffff00',
                            10.483951,  '#ffb000',
                            12.803808,  '#ff7f00',
                            14.311111, '#ff3f00',
                            15.589391, '#ff0000'
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

        if(value === 'high') {
            filter = ['>=', ['get', 'SUM_temper'], 15.589391];
        }
        else if(value === 'moderate-high') {
            filter = ['all',
                ['>=', ['get', 'SUM_temper'], 14.311111],
                ['<', ['get', 'SUM_temper'], 15.589391]
            ];
        }
        else if(value === 'moderate'){
            filter = ['all',
                ['>=', ['get', 'SUM_temper'], 12.803808],
                ['<', ['get', 'SUM_temper'], 14.311111]
            ];
        } 
        else if(value === 'low-moderate') {
            filter = ['all',
                ['>=', ['get', 'SUM_temper'], 10.483951],
                ['<', ['get', 'SUM_temper'], 12.803808]
            ];
        }
        else if (value === 'low') {
            filter = ['<', ['get', 'SUM_temper'], 10.483951];
        }

        map.setFilter(layerId, filter);

        if (map.getLayer(layerId + '-outline')) {
            map.setFilter(layerId + '-outline', filter);
        }
    });
}