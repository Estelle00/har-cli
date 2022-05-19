"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
async function getConfig() {
    const { default: vitePluginExternal } = await Promise.resolve().then(() => __importStar(require("@har/vite-plugin-external")));
    const { default: vue } = await Promise.resolve().then(() => __importStar(require("@vitejs/plugin-vue")));
    const { default: vueJsx } = await Promise.resolve().then(() => __importStar(require("@vitejs/plugin-vue-jsx")));
    return {
        mode: "production",
        build: {
            emptyOutDir: false,
            minify: false,
            brotliSize: false,
            outDir: _1.OUT_DIR,
            rollupOptions: {
                input: ["src/index.ts"],
                output: [
                    {
                        format: "es",
                        dir: _1.OUT_DIR_ES,
                        entryFileNames: "[name].js",
                        preserveModules: true,
                        preserveModulesRoot: "src",
                    },
                    {
                        format: "commonjs",
                        dir: _1.OUT_DIR_LIB,
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
}
exports.default = getConfig;
