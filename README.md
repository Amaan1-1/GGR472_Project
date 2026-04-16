# Mapping Urban Heat Islands & Green Infrastructure in Toronto

## Project Overview
This project addresses heat vulnerability in Toronto by visualizing the relationship between **Urban Heat Islands (UHI)** and existing **Green Infrastructure (GI)**. Our tool allows environmental planners and citizens to critically analyze whether natural cooling systems—like green roofs, streets, and parks—are strategically located in the city's hottest areas.

## Objectives
* **Visualize Heat Exposure:** Display average temperatures across Toronto using NASA-derived climate data.
* **Map Green Solutions:** Layer datasets for green streets, green roofs, and green spaces (parks/forests).
* **Identify Gaps:** Use spatial analysis to find "vulnerability gaps" where high heat intensity lacks sufficient green infrastructure.
* **Strategic Planning:** Provide a grounds for planning future GI implementation in priority zones.

---

## Data Sources

| Feature | Description | Source |
| :--- | :--- | :--- |
| **Heat Vulnerability** | Average Heat Degree Day index (20°C threshold). | [NASA Earthdata / Toronto Degree 20](https://github.com/Moraine729/Toronto_Heat_Vulnerability/blob/main/Results/pca_vuln_index.zip) |
| **Green Streets** | Road-based infrastructure for rainwater and vegetation. | [City of Toronto Open Data](https://open.toronto.ca/dataset/green-streets/) |
| **Green Roofs** | Building permits identifying residential/commercial green roofs. | [City of Toronto Open Data](https://open.toronto.ca/dataset/building-permits-green-roofs/) |
| **Green Spaces** | Polygon geometries for parks, beaches, and open spaces. | [City of Toronto Open Data](https://open.toronto.ca/dataset/green-spaces/) |

---

## Design & Interactivity
* **Dark-Themed UI:** A high-contrast dark basemap ensures that the heat intensity choropleth and GI markers are clearly visible.
* **Dynamic Sidebar:** Features toggles for GI layers and a custom dropdown to filter by Temperature Index levels.
* **Mapbox Integration:** Includes a functional search bar (Geocoder), navigation controls, and a reset view button.
* **Spatial Analysis (Turf.js):** Integrated functions to compute distances and identify spatial intersections between layers.
* **Accessibility:** Adheres to cartographic best practices with clear symbology, avoiding text overlap, and maintaining readability at all scales.
