"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileTree = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = require("fs-extra");
function writeFileTree(dir, files) {
    Object.keys(files).forEach((name) => {
        const filePath = node_path_1.default.join(dir, name);
        (0, fs_extra_1.ensureDirSync)(node_path_1.default.dirname(filePath));
        (0, fs_extra_1.writeFileSync)(filePath, files[name]);
    });
}
exports.writeFileTree = writeFileTree;
