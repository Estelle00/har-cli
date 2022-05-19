"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_doc_dev_1 = __importDefault(require("../../config/vite.doc.dev"));
async function run() {
    const config = await (0, vite_doc_dev_1.default)();
    const server = await (0, vite_1.createServer)(config);
    await server.listen();
}
exports.default = run;
