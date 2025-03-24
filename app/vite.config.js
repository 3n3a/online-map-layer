import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { Mode, plugin as markdownPlugin } from "vite-plugin-markdown";

export default defineConfig({
  resolve: {
    alias: {
      "ol/proj/proj4": resolve("node_modules/ol/proj/proj4.js"),
    },
  },
  server: {
    port: process.env.PORT || 3000,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/leaflet/dist/images/*",
          dest: "",
        },
      ],
    }),
    markdownPlugin({
        mode: [ Mode.HTML ],
    })
  ],
});
