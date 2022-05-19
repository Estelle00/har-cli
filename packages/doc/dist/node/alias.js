"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAliases = exports.DEFAULT_THEME_PATH = exports.SITE_DATA_PATH = exports.SITE_DATA_ID = exports.APP_PATH = exports.DIST_CLIENT_PATH = void 0;
const node_path_1 = __importDefault(require("node:path"));
const PKG_ROOT = node_path_1.default.join(__dirname, "../../");
exports.DIST_CLIENT_PATH = node_path_1.default.join(__dirname, "../client");
exports.APP_PATH = node_path_1.default.join(exports.DIST_CLIENT_PATH, "app");
exports.SITE_DATA_ID = "@siteData";
exports.SITE_DATA_PATH = "/" + exports.SITE_DATA_ID;
console.log(exports.DIST_CLIENT_PATH);
exports.DEFAULT_THEME_PATH = node_path_1.default.join(exports.DIST_CLIENT_PATH, "theme-default");
function resolveAliases(themeDir) {
    const paths = {
        "/@theme": themeDir,
        [exports.SITE_DATA_ID]: exports.SITE_DATA_PATH,
    };
    return [
        ...Object.keys(paths).map((p) => ({
            find: p,
            replacement: paths[p],
        })),
        {
            find: /^@har\/doc$/,
            replacement: node_path_1.default.join(__dirname, "../client/index"),
        },
        { find: /^@har\/doc\//, replacement: PKG_ROOT + "/" },
        {
            find: /^@har\/doc\/theme$/,
            replacement: node_path_1.default.join(__dirname, "../client/theme-default/index"),
        },
    ];
}
exports.resolveAliases = resolveAliases;
