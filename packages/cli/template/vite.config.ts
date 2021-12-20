import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import styleImport from "vite-plugin-style-import";
import { viteMockServe } from "vite-plugin-mock";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@\/(.*)/,
        replacement: resolve(process.cwd(), "src/", "$1"),
      },
    ],
  },
  plugins: [
    vue(),
    viteMockServe(),
    styleImport({
      libs: [
        {
          libraryName: "vant",
          esModule: true,
          resolveStyle: (name: string) => `vant/es/${name}/style/index`,
        },
      ],
    }),
    Pages({
      exclude: ["**/components/*.vue"],
    }),
  ],
});
