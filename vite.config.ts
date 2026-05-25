import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import netlify from "@netlify/vite-plugin";

export default defineConfig({
  plugins: [
    netlify(),
    VitePWA({
      registerType: "autoUpdate",
    }),
  ],
});
