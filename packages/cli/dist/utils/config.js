"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfigFromFile = void 0;
const index_1 = require("./index");
const fs_extra_1 = require("fs-extra");
const node_path_1 = __importDefault(require("node:path"));
const url_1 = require("url");
async function loadConfigFromFile(fileSrc, configRoot = process.cwd()) {
    let isTS = false;
    let isESM = false;
    const pkgDir = (0, index_1.lookupFile)(configRoot, ["package.json"], true);
    if (pkgDir) {
        const pkg = (0, fs_extra_1.readJsonSync)(pkgDir);
        if (pkg && pkg.type === "module") {
            isESM = true;
        }
    }
    const resolvedPath = node_path_1.default.resolve(fileSrc);
    isTS = fileSrc.endsWith(".ts");
    if (fileSrc.endsWith(".mjs"))
        isESM = true;
    if (!resolvedPath)
        return null;
    if (isESM) {
        const fileUrl = (0, url_1.pathToFileURL)(resolvedPath);
    }
}
exports.loadConfigFromFile = loadConfigFromFile;
