import L from "leaflet";
import { map, overlays, layerControl } from "./map.js";
import { convertCoords, generatePopupContent } from "./utils.js";

// Adds or replaces a GeoJSON layer on the map.
export function addGeoJsonLayer(geojsonData, layerName, srcProjection) {
  const srcProjectionFromGeoJson =
    geojsonData.crs?.properties?.name || undefined;

  // Process and convert all coordinates
  geojsonData.features = geojsonData.features.map((feature) => {
    const newFeature = feature;
    let coords = newFeature.geometry.coordinates;
    const srcProj =
      newFeature.geometry.srcProjection ||
      srcProjectionFromGeoJson ||
      srcProjection;
    // Flatten coordinates up to 3 levels
    coords = coords.flat(5);
    let convertedLatLng = convertCoords(coords, srcProj);
    if (newFeature.geometry.type === "Polygon") {
      // For polygons, wrap in an additional array
      convertedLatLng = [convertedLatLng];
    }
    newFeature.geometry.coordinates = convertedLatLng;
    return newFeature;
  });
  geojsonData.crs = undefined;

  console.log(geojsonData);

  if (overlays[layerName]) {
    map.removeLayer(overlays[layerName]);
    layerControl.removeLayer(overlays[layerName]);
  }
  const geoLayer = L.geoJSON(geojsonData, {
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        layer.bindPopup(generatePopupContent(feature.properties));
      }
    },
  });
  overlays[layerName] = geoLayer;
  geoLayer.addTo(map);
  layerControl.addOverlay(geoLayer, layerName);
  console.log("Added New Layer...");
}
