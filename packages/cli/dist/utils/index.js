"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupFile = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = require("fs-extra");
function lookupFile(dir, formats, pathOnly = false) {
    for (const format of formats) {
        const fullPath = node_path_1.default.join(dir, format);
        if ((0, fs_extra_1.pathExistsSync)(fullPath)) {
            return pathOnly ? fullPath : (0, fs_extra_1.readFileSync)(fullPath, "utf-8");
        }
    }
    const parentDir = node_path_1.default.dirname(dir);
    if (parentDir !== dir) {
        return lookupFile(parentDir, formats, pathOnly);
    }
}
exports.lookupFile = lookupFile;
