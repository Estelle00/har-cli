import { InlineConfig } from "vite";
import vitePluginExternal from "@har/vite-plugin-external";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { OUT_DIR, OUT_DIR_ES, OUT_DIR_LIB } from ".";

const config: InlineConfig = {
  mode: "production",
  build: {
    emptyOutDir: false,
    minify: false,
    brotliSize: false,
    outDir: OUT_DIR,
    rollupOptions: {
      input: ["src/index.ts"],
      output: [
        {
          format: "es",
          dir: OUT_DIR_ES,
          entryFileNames: "[name].js",
          preserveModules: true,
          preserveModulesRoot: "src",
        },
        {
          format: "commonjs",
          dir: OUT_DIR_LIB,
          entryFileNames: "[name].js",
          preserveModules: true,
          preserveModulesRoot: "src",
        },
      ],
    },
    // 开启lib模式，但不使用下面配置
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
    },
  },
  plugins: [vitePluginExternal(), vue(), vueJsx()],
};
export default config;
