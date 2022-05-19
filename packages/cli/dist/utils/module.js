"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModule = exports.resolveModule = void 0;
const node_module_1 = require("node:module");
const node_path_1 = __importDefault(require("node:path"));
function resolveModule(request, context) {
    try {
        return (0, node_module_1.createRequire)(node_path_1.default.resolve(context, "package.json")).resolve(request);
    }
    catch (e) {
        return require.resolve(request, {
            paths: [context],
        });
    }
}
exports.resolveModule = resolveModule;
function loadModule(request, context) {
    try {
        return (0, node_module_1.createRequire)(node_path_1.default.resolve(context, "package.json"))(request);
    }
    catch (e) {
        const resolvePath = resolveModule(request, context);
        if (resolvePath) {
            return require(resolvePath);
        }
    }
}
exports.loadModule = loadModule;
