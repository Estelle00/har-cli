"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrontMatter = exports.isDemoMarkdown = exports.isVirtualModule = exports.getVirtualPath = void 0;
const VIRTUAL_KEY = "/@virtual-demo:";
function getVirtualPath(filename) {
    return VIRTUAL_KEY + filename;
}
exports.getVirtualPath = getVirtualPath;
function isVirtualModule(id) {
    return new RegExp(VIRTUAL_KEY).test(id);
}
exports.isVirtualModule = isVirtualModule;
function isDemoMarkdown(id) {
    return /\/__demo__\//.test(id);
}
exports.isDemoMarkdown = isDemoMarkdown;
function getFrontMatter(tokens) {
    for (const token of tokens) {
        if (token.type === "frontMatter")
            return token.data;
    }
    return undefined;
}
exports.getFrontMatter = getFrontMatter;
