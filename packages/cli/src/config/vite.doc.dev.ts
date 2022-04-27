import { defineConfig, InlineConfig } from "vite";
import path from "node:path";
import { CWD } from "./index";
export default async function () {
  const { default: createVueDoc } = await import("@har/vite-plugin-doc");
  const { default: vuePlugin } = await import("@vitejs/plugin-vue");
  const { default: vueJsx } = await import("@vitejs/plugin-vue-jsx");
  return defineConfig({
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
}
