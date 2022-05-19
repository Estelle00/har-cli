"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pkg_1 = require("../../utils/pkg");
const Generator_1 = __importDefault(require("./Generator"));
const module_1 = require("../../utils/module");
class Creator {
    constructor(name, context) {
        this.name = name;
        this.context = context;
    }
    async create() {
        const { name, context } = this;
        const pkg = {
            name,
            version: "0.0.0",
            private: true,
            devDependencies: {},
            ...(0, pkg_1.resolvePkg)(context),
        };
        const rawPlugins = {
            "eslint-config": {},
            "tsconfig": {},
        };
        const plugins = await this.resolvePlugins(rawPlugins);
        const generator = new Generator_1.default(context, { plugins, pkg });
        await generator.generate();
    }
    async resolvePlugins(rawPlugins) {
        const plugins = [];
        for (const id of Object.keys(rawPlugins)) {
            const moduleId = `@har/${id}/generator`;
            // const t = createRequire(path.resolve(this.context, "package.json"))(
            //   moduleId
            // );
            // console.log(t);
            const apply = (0, module_1.loadModule)(moduleId, this.context);
            plugins.push({
                apply,
                options: rawPlugins[id] || {},
            });
        }
        console.log(0);
        return plugins;
    }
}
exports.default = Creator;
