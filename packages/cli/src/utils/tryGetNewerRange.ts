import { gt, valid } from "semver";
const rangeToVersion = (r: string) =>
  r.replace(/^(~|\^|>=?)/, "").replace(/x/g, "0");
export default function tryGetNewerRange(r1: string, r2: string) {
  const v1 = rangeToVersion(r1);
  const v2 = rangeToVersion(r2);
  if (valid(v1) && valid(v2)) {
    return gt(v1, v2) ? r1 : r2;
  }
}
