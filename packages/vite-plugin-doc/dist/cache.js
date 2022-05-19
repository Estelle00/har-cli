"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.setCache = void 0;
const cache = new Map();
function setCache(id, context) {
    cache.set(id, context);
}
exports.setCache = setCache;
function getCache(id) {
    return cache.get(id);
}
exports.getCache = getCache;
