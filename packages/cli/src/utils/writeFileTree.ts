import path from "node:path";
import { ensureDirSync, writeFileSync } from "fs-extra";

export function writeFileTree(dir: string, files: Record<string, string>) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    ensureDirSync(path.dirname(filePath));
    writeFileSync(filePath, files[name]);
  });
}
