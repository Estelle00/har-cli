"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const ejs_1 = __importDefault(require("ejs"));
const fs_extra_1 = require("fs-extra");
const deepmerge_1 = __importDefault(require("deepmerge"));
const tryGetNewerRange_1 = __importDefault(require("../../utils/tryGetNewerRange"));
const fast_glob_1 = require("fast-glob");
const isObject = (val) => val && typeof val === "object";
function arrayMerge(a, b) {
    return Array.from(new Set([...a, ...b]));
}
function depsMerge(generatorId, sourceDeps, depsToInject, sources) {
    const result = { ...sourceDeps };
    for (const depName in depsToInject) {
        const sourceRange = sourceDeps[depName];
        const injectingRange = depsToInject[depName];
        if (sourceRange === injectingRange) {
            continue;
        }
        if (!sourceRange) {
            result[depName] = injectingRange;
            sources[depName] = generatorId;
        }
        else {
            const r = (0, tryGetNewerRange_1.default)(sourceRange, injectingRange);
            result[depName] = r || injectingRange;
        }
        if (result[depName] === injectingRange) {
            sources[depName] = generatorId;
        }
    }
    return result;
}
// 获取调用者目录地址
function extractCallDir() {
    const obj = {};
    Error.captureStackTrace(obj);
    // @ts-ignore
    const callSite = obj.stack.split("\n")[3];
    const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
    const anonymousStackRegExp = /at (.*):\d+:\d+$/;
    let matchResult = callSite.match(namedStackRegExp);
    if (!matchResult) {
        matchResult = callSite.match(anonymousStackRegExp);
    }
    const fileName = matchResult[1];
    return node_path_1.default.dirname(fileName);
}
function renderFile(name, data, ejsOptions) {
    const template = (0, fs_extra_1.readFileSync)(name, "utf-8");
    return ejs_1.default.render(template, data, ejsOptions);
}
class GeneratorAPI {
    constructor(id, generator) {
        this.id = id;
        this.generator = generator;
        console.log(id);
    }
    resolve(...paths) {
        return node_path_1.default.resolve(this.generator.context, ...paths);
    }
    extendPackage(files) {
        const { pkg } = this.generator;
        for (const key in files) {
            const val = files[key];
            const existing = pkg[key];
            if (isObject(val) && ["dependencies", "devDependencies"].includes(key)) {
                pkg[key] = depsMerge(this.id, existing || {}, val, this.generator.depSources);
            }
            else if (!(key in pkg)) {
                pkg[key] = val;
            }
            else if (Array.isArray(val) && Array.isArray(existing)) {
                pkg[key] = arrayMerge(existing, val);
            }
            else if (isObject(val) && isObject(existing)) {
                pkg[key] = (0, deepmerge_1.default)(existing, val, {
                    arrayMerge,
                });
            }
            else {
                pkg[key] = val;
            }
        }
    }
    injectMiddleware(middleware) {
        this.generator.fileMiddlewares.push(middleware);
    }
    render(source, addData = {}, ejsOptions = {}) {
        const baseDir = extractCallDir();
        source = node_path_1.default.resolve(baseDir, source);
        this.injectMiddleware(async (files) => {
            const _files = (0, fast_glob_1.sync)("**", {
                cwd: source,
                dot: true,
            });
            console.log(_files, source);
            for (const rawPath of _files) {
                const targetPath = rawPath
                    .split("/")
                    .map((filename) => {
                    if (filename.charAt(0) === "_") {
                        if (filename.charAt(1) !== "_") {
                            // 处理下划线转.
                            return `.${filename.slice(1)}`;
                        }
                        else {
                            return filename.slice(1);
                        }
                    }
                    return filename;
                })
                    .join("/");
                const sourcePath = node_path_1.default.resolve(source, rawPath);
                const content = await renderFile(sourcePath, addData, ejsOptions);
                if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
                    files[targetPath] = content;
                }
            }
        });
        // 添加文件处理方法
    }
}
exports.default = GeneratorAPI;
