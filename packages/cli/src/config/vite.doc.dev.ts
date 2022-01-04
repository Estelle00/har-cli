import { defineConfig, InlineConfig } from "vite";
import path from "node:path";
import { CWD } from "./index";
import createVueDoc from "@har/vite-plugin-doc";
import vuePlugin from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
export default defineConfig({
  mode: "development",
  server: {
    open: true,
    host: "0.0.0.0",
    port: 2333,
    fs: {
      strict: true,
      allow: [".."],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(CWD, "src"),
    },
  },
  plugins: [createVueDoc(), vuePlugin(), vueJsx()],
}) as InlineConfig;
