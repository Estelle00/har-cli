"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const fs_1 = require("fs");
function lookupPackageFile(dir = process.cwd()) {
    const fullPath = (0, node_path_1.join)(dir, "package.json");
    if ((0, fs_1.existsSync)(fullPath) && (0, fs_1.statSync)(fullPath).isFile()) {
        return JSON.parse((0, fs_1.readFileSync)(fullPath, "utf-8"));
    }
    return false;
}
const data = lookupPackageFile();
function externalPlugin() {
    return {
        name: "vite:external-node_modules",
        enforce: "pre",
        async resolveId(source, importer) {
            if (new RegExp("^" + data.name).test(source)) {
                return false;
            }
            const result = await this.resolve(source, importer, {
                skipSelf: true,
                custom: { "node-resolve": {} },
            });
            if (result && /node_modules/.test(result.id)) {
                return false;
            }
            return null;
        },
    };
}
exports.default = externalPlugin;
