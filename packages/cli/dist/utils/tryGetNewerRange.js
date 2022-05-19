"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
const rangeToVersion = (r) => r.replace(/^(~|\^|>=?)/, "").replace(/x/g, "0");
function tryGetNewerRange(r1, r2) {
    const v1 = rangeToVersion(r1);
    const v2 = rangeToVersion(r2);
    if ((0, semver_1.valid)(v1) && (0, semver_1.valid)(v2)) {
        return (0, semver_1.gt)(v1, v2) ? r1 : r2;
    }
}
exports.default = tryGetNewerRange;
