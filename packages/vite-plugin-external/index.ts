import type { Plugin } from "vite";
import {join} from "node:path";
import {existsSync, readFileSync, statSync} from "fs";
function lookupPackageFile(dir = process.cwd()) {
  const fullPath = join(dir, "package.json");
  if (existsSync(fullPath) && statSync(fullPath).isFile()) {
    return JSON.parse(readFileSync(fullPath, "utf-8"));
  }
  return false;
}
const data = lookupPackageFile();
export default function externalPlugin(): Plugin {
  return {
    name: "vite:external-node_modules",
    enforce: "pre",
    async resolveId(source: string, importer) {
      if (new RegExp("^" + data.name).test(source)) {
        return false;
      }
      const result = await this.resolve(source, importer, {
        skipSelf: true,
        custom: { "node-resolve": {} },
      });

      if (result && /node_modules/.test(result.id)) {
        return false;
      }
      return null;
    },
  };
}
