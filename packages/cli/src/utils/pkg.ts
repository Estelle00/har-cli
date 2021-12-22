import { pathExistsSync, readJsonSync } from "fs-extra";
import { join } from "node:path";
import normalizeData from "normalize-package-data";
export function resolvePkg(context: string) {
  const filePath = join(context, "package.json");
  if (pathExistsSync(filePath)) {
    const json = readJsonSync(filePath);
    normalizeData(json);
    return json;
  }
  return {};
}
