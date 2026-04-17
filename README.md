# Mapping Urban Heat Islands & Green Infrastructure in Toronto

## Project Overview

This project addresses heat vulnerability in Toronto by visualizing the relationship between **Urban Heat Islands (UHI)** and existing **Green Infrastructure (GI)**. Developed for environmental planners and citizens, this tool analyzes whether natural cooling systems—like green roofs, streets, and parks—are strategically located in the city's most vulnerable areas.

The vulnerability data used in this project is provided by the **School of Cities**, reflecting a combination of heat exposure, sensitivity (e.g., tree canopy, age), and adaptive capacity (socioeconomic factors).

## Folder Structure

```text
project-root/
│
├── index.html              # Home page with main map and legend
├── analysis.html           # Spatial analysis tools page
├── style.css               # Global styles and layout
├── scripts/
│   ├── config.js           # API keys and Mapbox configuration
│   ├── script.js           # Map initialization and layer loading
│   └── functions.js        # Turf.js analysis and UI interactivity logic
└── data/
    ├── green_roofs.geojson # Building permit data
    ├── green_spaces.geojson# Parks and open spaces data
    ├── green_streets.geojson# Street-level GI data
    ├── heat_vulnerability_map.geojson # School of Cities PCA index
    ├── tree.png            # Map icons
    ├── house.png           
    ├── signpost.png        
    └── school_of_cities.jpg# Imgs for citing sources pg
    └── Open_Data_Toronto.jpg# 
````

## Objectives

* **Visualize Heat Vulnerability:** Display the uneven spatial distribution of heat impacts using the PCA vulnerability index.
* **Map Green Solutions:** Layer datasets for green streets, green roofs, and green spaces.
* **Proximity Analysis:** Measure distances between infrastructure points and create buffer zones to analyze service coverage.
* **Intensity Filtering:** Isolate specific vulnerability levels to identify priority zones for future GI implementation.

## Data Sources

| Feature                | Description                                                                       | Source                                                                                                                   |
| :--------------------- | :-------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **Heat Vulnerability** | Multivariate index based on exposure (>20°C), sensitivity, and adaptive capacity. | [School of Cities / Mapping Heat Vulnerability in Toronto](https://schoolofcities.github.io/heat-vulnerability-toronto/) |
| **Green Streets**      | Road-based infrastructure for rainwater and vegetation.                           | [City of Toronto Open Data](https://open.toronto.ca/dataset/green-streets/)                                              |
| **Green Roofs**        | Building permits identifying residential/commercial green roofs.                  | [City of Toronto Open Data](https://open.toronto.ca/dataset/building-permits-green-roofs/)                               |
| **Green Spaces**       | Polygon geometries for parks, beaches, and open spaces.                           | [City of Toronto Open Data](https://open.toronto.ca/dataset/green-spaces/)                                               |

## Technical Features & Interactivity

### Spatial Analysis Tools (Turf.js)

* **Distance Measurement:** Set two points on the map to calculate geodesic distance (km) and visualize the connection path.
* **Multi-Point Buffering:** Generate proximity buffers by clicking the map or using the "Add Buffer" tool within feature popups. Supports multiple simultaneous buffers for comparative analysis.
* **Coordinate Tracking:** Real-time longitude and latitude display via mouse movement.

### Data Visualization

* **Vulnerability Choropleth:** A 5-step color scale (Yellow to Red) categorizing areas by their `vuln_pc2` score.
* **Dynamic Filtering:** Dropdown menu to filter map views by specific vulnerability intensities (High to Low).
* **Interactive Popups:** Attribute information for GI features, including building permit types and area names.

### UI/UX

* **Layer Management:** Toggle visibility for individual datasets with automatic management of fill and outline layers.
* **Map Controls:** Mapbox Geocoder for location searching and a reset function for the default Toronto extent.
* **Layer Reordering:** Logic ensures point-based data and markers remain visible above polygon layers.

