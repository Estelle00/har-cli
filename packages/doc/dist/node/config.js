"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSiteData = exports.resolveConfig = void 0;
const node_path_1 = __importDefault(require("node:path"));
const vite_1 = require("vite");
const fs_extra_1 = __importDefault(require("fs-extra"));
const alias_1 = require("./alias");
const globby_1 = __importDefault(require("globby"));
function getThemeDir(root = process.cwd()) {
    const userThemeDir = resolve(root, "theme");
    if (fs_extra_1.default.pathExistsSync(userThemeDir)) {
        return userThemeDir;
    }
    return alias_1.DEFAULT_THEME_PATH;
}
async function resolveConfig(root = process.cwd(), command = "serve", mode = "development") {
    const [userConfig, configPath] = await resolveUserConfig(root, command, mode);
    const { srcExclude = [] } = userConfig;
    srcExclude.push("**/__demo__/**");
    const site = resolveSiteData(root, userConfig);
    const srcDir = node_path_1.default.resolve(root, userConfig.srcDir || ".");
    const outDir = userConfig.outDir
        ? node_path_1.default.resolve(root, userConfig.outDir)
        : resolve(root, "dist");
    const themeDir = getThemeDir(root);
    const pages = (await (0, globby_1.default)(["**.md"], {
        cwd: srcDir,
        ignore: ["**/node_modules", ...srcExclude],
    })).sort();
    return {
        root,
        srcDir,
        site,
        configPath,
        themeDir,
        outDir,
        tempDir: "",
        srcExclude,
        pages,
        alias: (0, alias_1.resolveAliases)(themeDir),
        vue: userConfig.vue,
        vite: userConfig.vite,
    };
}
exports.resolveConfig = resolveConfig;
const resolve = (root, file) => (0, vite_1.normalizePath)(node_path_1.default.resolve(root, `.doc`, file));
const supportedConfigExtensions = ["js", "ts", ".mjs", "mts"];
async function getFileConfig(configPath, root, command, mode) {
    if (configPath) {
        const data = await (0, vite_1.loadConfigFromFile)({
            command,
            mode,
        }, configPath, root);
        if (data && data.config) {
            return data.config;
        }
    }
    return {};
}
async function resolveUserConfig(root, command, mode) {
    let configPath;
    for (const ext of supportedConfigExtensions) {
        const p = resolve(root, `config.${ext}`);
        if (fs_extra_1.default.pathExistsSync(p)) {
            configPath = p;
            break;
        }
    }
    const userConfig = await getFileConfig(configPath, root, command, mode);
    return [await resolveConfigExtends(userConfig), configPath];
}
async function resolveConfigExtends(config) {
    const resolved = await (typeof config === "function" ? config() : config);
    if (resolved.extends) {
        const base = await resolveConfigExtends(resolved.extends);
        return (0, vite_1.mergeConfig)(base, resolved);
    }
    return resolved;
}
function resolveSiteData(root, userConfig) {
    return {
        base: userConfig.base ? userConfig.base.replace(/([^/])$/, "$1/") : "/",
        lang: userConfig.lang || "zh-CN",
        title: userConfig.title || "vue-doc",
        description: userConfig.description || "A vue doc site",
        head: userConfig.head || [],
        themeConfig: userConfig.themeConfig || {},
    };
}
exports.resolveSiteData = resolveSiteData;
