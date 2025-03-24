import L from "leaflet";
import { map, overlays, layerControl } from "./map.js";
import { convertCoords, generatePopupContent, parseCRS } from "./utils.js";

// Adds or replaces a GeoJSON layer on the map.
export function addGeoJsonLayer(geojsonData, layerName, srcProjection) {
  const srcProjectionFromGeoJson =
    geojsonData.crs?.properties?.name || undefined;

  // Process and convert all coordinates
  geojsonData.bbox = geojsonData.bbox ? convertCoords(geojsonData.bbox, srcProjection || parseCRS(srcProjectionFromGeoJson), undefined, true) : undefined;
  geojsonData.features = geojsonData.features.map((feature) => {
    const newFeature = feature;
    let coords = newFeature.geometry.coordinates;
    const srcProj = parseCRS(newFeature.geometry.srcProjection) ||
      srcProjection || 
      parseCRS(srcProjectionFromGeoJson);
    let convertedLatLng = convertCoords(coords, srcProj, newFeature.geometry.type);
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
        layer.bindPopup(generatePopupContent(feature.properties), {
          closeOnEscapeKey: true,
          interactive: true,
        });
      }
      layer.on("click", (event) => {
        const layer = event.target;
        layer.setStyle({
          weight: 3,
          color: '#d43900',
          dashArray: '',
          fillOpacity: 0.1,
        });
        layer.bringToFront();
      });
      layer.on("popupclose", (event) => {
        const layer = event.target;
        geoLayer.resetStyle(layer);
      })
    },
  });
  overlays[layerName] = geoLayer;
  geoLayer.addTo(map);
  layerControl.addOverlay(geoLayer, layerName);
  if (geojsonData.hasOwnProperty("bbox") && !!geojsonData.bbox) {
    map.fitBounds(geojsonData.bbox, {animate: true });
  }
  console.log("Added New Layer...");
}
