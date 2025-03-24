import "./style.css";
import { processJsonContent, processZipContent, loadWFSLayer } from "./data.js";
import { MAP_TARGET_SRS, setupMap } from "./map.js";
import { html } from '../README.md';

function handleFileInputChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const layerName = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target.result;
    if (file.name.toLowerCase().endsWith(".zip")) {
      processZipContent(result, layerName);
    } else if (file.name.toLowerCase().endsWith(".json")) {
      processJsonContent(result, layerName);
    } else {
      alert("Unsupported file type.");
    }
  };
  if (file.name.toLowerCase().endsWith(".zip")) {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
}

async function handleLoadButtonClick() {
  const urlBtn = document.getElementById("urlBtn");
  urlBtn.innerText = 'Loading...';
  urlBtn.disabled = true;

  const url = document.getElementById("urlInput").value.trim();
  if (!url) return;
  const serviceType = document.getElementById("serviceType").value;
  const layerName = url.split("/").pop().split("?")[0] || "remoteLayer";
  if (serviceType === "WFS") {
    await loadWFSLayer(url, layerName);
    urlBtn.innerText = 'Load';
    urlBtn.disabled = false;
    return;
  }
  // Default: handle as GeoJSON/ZIP
  fetch(url)
    .then((response) => {
      const contentType = response.headers.get("Content-Type") || "";
      let srcProjection;
      if (url.toLowerCase().includes("data.sbb.ch")) {
        console.log("Setting Projection for SBB Data Url");
        srcProjection = MAP_TARGET_SRS;
      }
      if (
        url.toLowerCase().endsWith(".zip") ||
        contentType.includes("application/zip")
      ) {
        return response.arrayBuffer().then((buffer) => {
          processZipContent(buffer, layerName);
        });
      } else if (
        url.toLowerCase().endsWith(".json") ||
        contentType.includes("application/json")
      ) {
        return response.text().then((text) => {
          processJsonContent(text, layerName, srcProjection);
        });
      } else {
        return response.text().then((text) => {
          try {
            JSON.parse(text);
            processJsonContent(text, layerName, srcProjection);
          } catch (e) {
            alert("URL did not return valid JSON or ZIP content.");
          }
        });
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Error fetching URL: " + error);
    })
    .finally(() => {
      urlBtn.innerText = 'Load';
      urlBtn.disabled = false;
    });
}

function setupEventListeners() {
  // Handle file upload
  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileInputChange);
  
  // Handle URL input and service type
  document
    .getElementById("urlBtn")
    .addEventListener("click", handleLoadButtonClick);
}

function setupMoreInfo() {
  const moreInfo = document.getElementById("more-info");
  let moreInfoHTML = html;
  moreInfoHTML = moreInfoHTML.replaceAll("<table>", "<div class=\"table-responsive\"><table>");
  moreInfoHTML = moreInfoHTML.replaceAll("</table>", "</table></div>");
  moreInfoHTML = moreInfoHTML.replaceAll("<a", "<a target=\"_blank\"")
  moreInfo.innerHTML = `
  <div class="x-button">
    <a href="#">✕</a>
  </div>
  <div class="popup-content">${moreInfoHTML}</div>
  `
}

setupMap("map");
setupEventListeners()

setupMoreInfo();