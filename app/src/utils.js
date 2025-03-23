import proj4 from "proj4";
import { register } from "ol/proj/proj4";
register(proj4);
import { DEFAULT_SRS, MAP_TARGET_SRS } from "./map.js";

// Splits an array into chunks of the given size.
export function chunk(arr, size = 2) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Converts coordinates from source projection to target (MAP_TARGET_SRS)
export function convertCoords(coords, srcProjection) {
  coords = coords.filter((coord) => !!coord);
  if (coords.length > 2) {
    const chunks = chunk(coords, 2);
    return chunks.map((chunk) => convertCoords(chunk, srcProjection));
  }
  if (!srcProjection) {
    console.log("Assuming default srcProjection", DEFAULT_SRS, coords);
    srcProjection = DEFAULT_SRS;
  }
  try {
    return proj4(srcProjection, MAP_TARGET_SRS, coords);
  } catch (e) {
    console.error("Error converting coords", e, coords, srcProjection);
  }
}

// Generates an HTML table for feature popup content.
export function generatePopupContent(properties) {
  let html = "<table>";
  for (const key in properties) {
    if (key !== "GlobalId") {
      html += `<tr><th>${key}</th><td>${properties[key]}</td></tr>`;
    }
  }
  if (properties.GlobalId) {
    html += `<tr><td colspan="2"><strong>GlobalId: ${properties.GlobalId}</strong></td></tr>`;
  }
  html += "</table>";
  return html;
}