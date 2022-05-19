"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
const vite_1 = require("vite");
const config_1 = require("../config");
const vite_prod_1 = __importDefault(require("../config/vite.prod"));
async function run() {
    await fs_extra_1.default.emptyDir(node_path_1.default.resolve(config_1.CWD, config_1.OUT_DIR, "es"));
    await fs_extra_1.default.emptyDir(node_path_1.default.resolve(config_1.CWD, config_1.OUT_DIR, "lib"));
    const config = await (0, vite_prod_1.default)();
    await (0, vite_1.build)(config);
}
exports.default = run;
