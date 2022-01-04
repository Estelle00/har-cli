import path from "node:path";
import { pathExistsSync, readFileSync } from "fs-extra";

export function lookupFile(
  dir: string,
  formats: string[],
  pathOnly = false
): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format);
    if (pathExistsSync(fullPath)) {
      return pathOnly ? fullPath : readFileSync(fullPath, "utf-8");
    }
  }
  const parentDir = path.dirname(dir);
  if (parentDir !== dir) {
    return lookupFile(parentDir, formats, pathOnly);
  }
}
