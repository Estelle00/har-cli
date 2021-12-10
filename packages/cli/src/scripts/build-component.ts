import fs from "fs-extra";
import path from "path";
import config from "../config/vite.prod";
import { build } from "vite";
import { CWD, OUT_DIR } from "../config";
async function run() {
  await fs.emptyDir(path.resolve(CWD, OUT_DIR, "es"));
  await fs.emptyDir(path.resolve(CWD, OUT_DIR, "lib"));
  await build(config);
}
export default run;
