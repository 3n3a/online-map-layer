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

export function parseCRS(urn) {
  if (!urn) {
    return null;
  }
  const match = urn.match(/^(?:urn:ogc:def:crs:EPSG::|EPSG:)?(\d+)$/);
  return match ? `EPSG:${match[1]}` : null;
}

// Converts coordinates from source projection to target (MAP_TARGET_SRS)
export function convertCoords(coords, srcProjection, geometryType=undefined, flipped=false) {
  // filter out empty coordinates
  coords = coords.filter((coord) => !!coord);

  geometryType = !!geometryType ? String(geometryType).toLowerCase() : undefined;

  // process more than one set of coords
  const firstElem = coords[0];
  const firstElemIsArray = Array.isArray(firstElem)
  if (coords.length > 2 || (firstElemIsArray && geometryType && ["linestring", "polygon", "multipoint", "multilinestring", "multipolygon"].includes(geometryType))) {

    if (!firstElemIsArray) {
      // must be a list of [ <lon>, <lat>, <lon>, <lat>, ... ]
      const chunks = chunk(coords, 2);
      return chunks.map((chunk) => convertCoords(chunk, srcProjection, undefined, flipped));
    }

    // assumed all these have firstElemIsArray = true
    // documentation: https://geobgu.xyz/web-mapping/geojson-1.html (Table 7.2)
    // spec: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1
    if (["LineString", "MultiPoint"].includes(geometryType)) {
      // [ [<lon>, <lat>], ... ]
      return coords.map((coord) => convertCoords(coord, srcProjection, undefined, flipped));
    }
    else if (["polygon", "multilinestring"].includes(geometryType)) {
      // [ [ [<lon>, <lat>], [<lon>, <lat>], ... ], [ [<lon>, <lat>], [<lon>, <lat>], ... ], ]
      return coords.map((coordGroup) => {
        return coordGroup.map((coord) => convertCoords(coord, srcProjection, undefined, flipped));
      })
    }
    else if (["multipolygon"].includes(geometryType)) {
      // [ [ [ [<lon>, <lat>], [<lon>, <lat>], ... ], [ [<lon>, <lat>], [<lon>, <lat>], ... ], ], ... ]
      return coords.map((coordParentGroup) => {
        return coordParentGroup.map((coordGroup) => {
          return coordGroup.map((coord) => convertCoords(coord, srcProjection, undefined, flipped));
        })
      })
    } else {
      throw new Error("no geometry type parser found for", JSON.stringify(geometryType))
    }
  }
  if (!srcProjection) {
    console.log("Assuming default srcProjection", DEFAULT_SRS, coords);
    srcProjection = DEFAULT_SRS;
  }
  try {
    const transformed = proj4(srcProjection, MAP_TARGET_SRS, coords);
    if (flipped) {
      console.log("flipped from", transformed, "to", [transformed[1], transformed[0]])
      return [transformed[1], transformed[0]];
    } else {
      return transformed;
    }
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