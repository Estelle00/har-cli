import { InlineConfig } from "vite";
import { OUT_DIR, OUT_DIR_ES, OUT_DIR_LIB } from ".";
async function getConfig(): Promise<InlineConfig> {
  const { default: vitePluginExternal } = await import(
    "@har/vite-plugin-external"
  );
  const { default: vue } = await import("@vitejs/plugin-vue");
  const { default: vueJsx } = await import("@vitejs/plugin-vue-jsx");
  return {
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
  } as InlineConfig;
}
export default getConfig;
