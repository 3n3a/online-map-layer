import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "ol/proj/proj4": resolve("node_modules/ol/proj/proj4.js"),
    },
  },
  server: {
    port: process.env.PORT || 3000,
  },
});
