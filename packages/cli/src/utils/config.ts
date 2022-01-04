import { lookupFile } from "./index";
import { readJsonSync } from "fs-extra";
import path from "node:path";
import { pathToFileURL } from "url";
export async function loadConfigFromFile(
  fileSrc: string,
  configRoot: string = process.cwd()
) {
  let isTS = false;
  let isESM = false;
  const pkgDir = lookupFile(configRoot, ["package.json"], true);
  if (pkgDir) {
    const pkg = readJsonSync(pkgDir);
    if (pkg && pkg.type === "module") {
      isESM = true;
    }
  }
  const resolvedPath = path.resolve(fileSrc);
  isTS = fileSrc.endsWith(".ts");
  if (fileSrc.endsWith(".mjs")) isESM = true;
  if (!resolvedPath) return null;
  if (isESM) {
    const fileUrl = pathToFileURL(resolvedPath);
  }
}
