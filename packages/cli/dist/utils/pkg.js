"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePkg = void 0;
const fs_extra_1 = require("fs-extra");
const node_path_1 = require("node:path");
const normalize_package_data_1 = __importDefault(require("normalize-package-data"));
function resolvePkg(context) {
    const filePath = (0, node_path_1.join)(context, "package.json");
    if ((0, fs_extra_1.pathExistsSync)(filePath)) {
        const json = (0, fs_extra_1.readJsonSync)(filePath);
        (0, normalize_package_data_1.default)(json);
        return json;
    }
    return {};
}
exports.resolvePkg = resolvePkg;
