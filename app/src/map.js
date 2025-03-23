import L from "leaflet";
import proj4 from "proj4";

export const DEFAULT_SRS = "EPSG:2056"; // Switzerland
export const MAP_TARGET_SRS = "EPSG:4326"; // GPS coordinates
export const WEB_MAP_SRS = "EPSG:3857"; // Web mapping (OSM, Google)

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = "&copy; OpenStreetMap contributors";

proj4.defs(
  DEFAULT_SRS,
  "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 " +
    "+k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel " +
    "+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
);

// Initialize Leaflet map
/**
 * @type L.Map | null
 */
export let map = null;

// Overlays and layer control
export const overlays = {};
export let layerControl = null;

export function setupMap(elementId) {
  map = L.map(elementId, {
    preferCanvas: true,
    center: [46.8, 8.2],
    zoom: 8,
    zoomControl: false,
  });
  map.whenReady(() => {
    map.addControl(L.control.zoom({ position: 'bottomright' }))
    layerControl = L.control.layers(null, overlays).addTo(map);
    L.tileLayer(TILE_URL, {
      attribution: ATTRIBUTION,
    }).addTo(map);
  })
}
