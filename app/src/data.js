import JSZip from "jszip";
import { WfsEndpoint } from "@camptocamp/ogc-client";
import { addGeoJsonLayer } from "./layers.js";

// Process JSON content (assumed GeoJSON)
export function processJsonContent(jsonStr, layerName, srcProjection) {
  try {
    const data = JSON.parse(jsonStr);
    addGeoJsonLayer(data, layerName, srcProjection);
  } catch (error) {
    alert("Error parsing JSON: " + error);
  }
}

// Process ZIP content and list contained JSON files.
export function processZipContent(arrayBuffer, layerName) {
  JSZip.loadAsync(arrayBuffer).then((zip) => {
    const jsonFiles = [];
    zip.forEach((relativePath, zipEntry) => {
      if (zipEntry.name.toLowerCase().endsWith(".json")) {
        jsonFiles.push(zipEntry.name);
      }
    });
    if (jsonFiles.length === 0) {
      alert("No JSON files found in the zip archive.");
      return;
    }
    const fileListDiv = document.getElementById("zipFileList");
    fileListDiv.innerHTML = `<p>Select a JSON file from the ZIP archive (<strong>${layerName}</strong>):</p>`;
    const select = document.createElement("select");
    jsonFiles.forEach((fname) => {
      const option = document.createElement("option");
      option.value = fname;
      option.textContent = fname;
      select.appendChild(option);
    });
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load Selected File";
    loadBtn.onclick = () => {
      const selectedFile = select.value;
      zip
        .file(selectedFile)
        .async("string")
        .then((fileContent) => {
          processJsonContent(fileContent, layerName);
          fileListDiv.innerHTML = "";
        });
    };
    fileListDiv.appendChild(select);
    fileListDiv.appendChild(loadBtn);
  });
}

async function loadFeatureLayer(client, featureType) {
  const featureUrl = client.getFeatureUrl(featureType.name, {
    asJson: true,

  });
  const res = await fetch(featureUrl);
  const geojson = await res.json();

  addGeoJsonLayer(geojson, featureType.title);
}

// Load a WFS layer using the ogc-client library.
export async function loadWFSLayer(url, layerName) {
  // Remove query parameters if URL contains GetCapabilities
  if (url.toLowerCase().includes("getcapabilities")) {
    url = url.split("?")[0];
  }

  try {
    const client = new WfsEndpoint(url);
    await client.isReady();

    const featureTypes = client.getFeatureTypes();

    const featureTypeList = document.getElementById("featureTypeList");
    featureTypeList.innerHTML = `<p>Select a Feature Type:</p>`;

    const select = document.createElement("select");
    featureTypes.sort((a, b) => a.title.localeCompare(b.title)).forEach((featureType) => {
      const option = document.createElement("option");
      option.value = featureType.name;
      option.textContent = featureType.title;
      select.appendChild(option);
    });
    const selectBtn = document.createElement("button");
    selectBtn.textContent = "Select Feature Type";
    selectBtn.onclick = async () => {
      selectBtn.innerText = "Loading...";
      selectBtn.disabled = true;

      const selectedFeatureType = featureTypes.find((f) => f.name === select.value);
      await loadFeatureLayer(client, selectedFeatureType)

      selectBtn.innerText = "Select Feature Type";
      selectBtn.disabled = false;
    }

    if (featureTypes.length === 0) {
      throw new Error('No Feature Types found for ' + url)
    }
    
    featureTypeList.appendChild(select);
    featureTypeList.appendChild(selectBtn);
  } catch (error) {
    alert("Error fetching WFS data: " + error);
  }
}
