"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkdownToVueRender = exports.transformDemo = exports.transformMain = void 0;
const node_path_1 = __importDefault(require("node:path"));
const cache_1 = require("./cache");
const marked_1 = __importDefault(require("./marked"));
const change_case_1 = require("change-case");
const vue_template_1 = require("./vue-template");
const utils_1 = require("./utils");
function transformMain(tokens, file, frontMatter) {
    const imports = [];
    const components = [];
    const includes = [];
    const dir = node_path_1.default.dirname(file);
    for (const token of tokens) {
        if (token.type === "fileImport") {
            const componentName = (0, change_case_1.pascalCase)(`demo-${token.basename}`);
            components.push(componentName);
            const includePath = node_path_1.default
                .join(dir, token.filename.replace(/"/g, ""))
                .toString();
            imports.push(`import ${componentName} from ${token.filename}`);
            includes.push(includePath);
        }
    }
    const html = marked_1.default.parser(tokens);
    const vueSrc = (0, vue_template_1.getMainVue)({ html, imports, components, data: frontMatter });
    return {
        vueSrc,
        includes,
    };
}
exports.transformMain = transformMain;
function transformDemo(tokens, filename, frontMatter) {
    const basename = node_path_1.default.basename(filename, ".md");
    const virtualPath = (0, utils_1.getVirtualPath)(filename);
    let description = "";
    if (frontMatter === null || frontMatter === void 0 ? void 0 : frontMatter.description) {
        description = (0, marked_1.default)(frontMatter.description);
    }
    const data = {
        id: basename,
        title: (frontMatter === null || frontMatter === void 0 ? void 0 : frontMatter.title) || "",
        description,
        virtualPath,
        code: "",
    };
    for (const token of tokens) {
        if (token.type === "blockquote") {
            data.description = (0, marked_1.default)(token.raw);
        }
        else if (token.type === "code" && token.lang === "vue") {
            (0, cache_1.setCache)(virtualPath, token.text);
            data.code = marked_1.default.parser([token]);
        }
    }
    return { vueSrc: (0, vue_template_1.getDemoVue)(data), includes: [] };
}
exports.transformDemo = transformDemo;
function createMarkdownToVueRender(srcDir) {
    return (src, file) => {
        const tokens = marked_1.default.lexer(src);
        const frontMatter = (0, utils_1.getFrontMatter)(tokens);
        return (0, utils_1.isDemoMarkdown)(file)
            ? transformDemo(tokens, file, frontMatter)
            : transformMain(tokens, file, frontMatter);
    };
}
exports.createMarkdownToVueRender = createMarkdownToVueRender;
