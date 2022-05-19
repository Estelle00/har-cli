"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GeneratorAPI_1 = __importDefault(require("./GeneratorAPI"));
const writeFileTree_1 = require("../../utils/writeFileTree");
class Generator {
    constructor(context, options) {
        this.context = context;
        this.depSources = {};
        this.fileMiddlewares = [];
        this.files = {};
        this.plugins = options.plugins;
        this.pkg = options.pkg;
    }
    initPlugins() {
        for (const plugin of this.plugins) {
            const { id, apply } = plugin;
            const api = new GeneratorAPI_1.default(id, this);
            console.log(1);
            apply(api);
        }
    }
    async generate() {
        await this.initPlugins();
        // const initialFiles = { ...this.files };
        await this.resolveFiles();
        this.files["package.json"] = JSON.stringify(this.pkg, null, 2);
        (0, writeFileTree_1.writeFileTree)(this.context, this.files);
    }
    async resolveFiles() {
        const files = this.files;
        for (const middleware of this.fileMiddlewares) {
            await middleware(files);
        }
    }
}
exports.default = Generator;
