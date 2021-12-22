import fs from "fs-extra";
import path from "node:path";
import { build } from "vite";
import { CWD, OUT_DIR } from "../config";
import getConfig from "../config/vite.prod";
async function run() {
  await fs.emptyDir(path.resolve(CWD, OUT_DIR, "es"));
  await fs.emptyDir(path.resolve(CWD, OUT_DIR, "lib"));
  const config = await getConfig();
  await build(config);
}
export default run;
