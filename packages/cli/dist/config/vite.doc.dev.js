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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const node_path_1 = __importDefault(require("node:path"));
const index_1 = require("./index");
async function default_1() {
    const { default: createVueDoc } = await Promise.resolve().then(() => __importStar(require("@har/vite-plugin-doc")));
    const { default: vuePlugin } = await Promise.resolve().then(() => __importStar(require("@vitejs/plugin-vue")));
    const { default: vueJsx } = await Promise.resolve().then(() => __importStar(require("@vitejs/plugin-vue-jsx")));
    return (0, vite_1.defineConfig)({
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
                "@": node_path_1.default.resolve(index_1.CWD, "src"),
            },
        },
        plugins: [createVueDoc(), vuePlugin(), vueJsx()],
    });
}
exports.default = default_1;
