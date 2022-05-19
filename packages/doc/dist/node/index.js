"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const vite_1 = require("vite");
const config_1 = require("./config");
const plugin_1 = require("./plugin");
async function createServer(root = process.cwd(), serverOptions = {}) {
    const config = await (0, config_1.resolveConfig)(root);
    return (0, vite_1.createServer)({
        root: config.srcDir,
        base: config.site.base,
        plugins: (0, plugin_1.createDocPlugin)(root, config),
        server: serverOptions,
    });
}
exports.createServer = createServer;
