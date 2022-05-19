"use strict";
//https://github.com/markedjs/marked/blob/master/src/helpers.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtrim = exports.resolveUrl = exports.cleanUrl = exports.escape = void 0;
const escapeTest = /[&<>"']/;
const escapeReplace = /[&<>"']/g;
const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape(html, encode) {
    if (encode) {
        if (escapeTest.test(html)) {
            return html.replace(escapeReplace, getEscapeReplacement);
        }
    }
    else {
        if (escapeTestNoEncode.test(html)) {
            return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
    }
    return html;
}
exports.escape = escape;
const nonWordAndColonTest = /[^\w:]/g;
const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function cleanUrl(sanitize, base, href) {
    if (sanitize) {
        let prot;
        try {
            prot = decodeURIComponent(unescape(href))
                .replace(nonWordAndColonTest, "")
                .toLowerCase();
        }
        catch (e) {
            return null;
        }
        if (prot.indexOf("javascript:") === 0 ||
            prot.indexOf("vbscript:") === 0 ||
            prot.indexOf("data:") === 0) {
            return null;
        }
    }
    if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
    }
    try {
        href = encodeURI(href).replace(/%25/g, "%");
    }
    catch (e) {
        return null;
    }
    return href;
}
exports.cleanUrl = cleanUrl;
const baseUrls = {};
const justDomain = /^[^:]+:\/*[^/]*$/;
const protocol = /^([^:]+:)[\s\S]*$/;
const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function resolveUrl(base, href) {
    if (!baseUrls[" " + base]) {
        if (justDomain.test(base)) {
            baseUrls[" " + base] = base + "/";
        }
        else {
            baseUrls[" " + base] = rtrim(base, "/", true);
        }
    }
    base = baseUrls[" " + base];
    const relativeBase = base.indexOf(":") === -1;
    if (href.substring(0, 2) === "//") {
        if (relativeBase) {
            return href;
        }
        return base.replace(protocol, "$1") + href;
    }
    else if (href.charAt(0) === "/") {
        if (relativeBase) {
            return href;
        }
        return base.replace(domain, "$1") + href;
    }
    else {
        return base + href;
    }
}
exports.resolveUrl = resolveUrl;
function rtrim(str, c, invert) {
    const l = str.length;
    if (l === 0) {
        return "";
    }
    let suffLen = 0;
    while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
            suffLen++;
        }
        else if (currChar !== c && invert) {
            suffLen++;
        }
        else {
            break;
        }
    }
    return str.substr(0, l - suffLen);
}
exports.rtrim = rtrim;
