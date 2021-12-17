import fs from "fs-extra";
import { CWD, TEMPLATE_DIR } from "../config";
import { resolve } from "path";
import Creator from "./create/Creator";
function copy(filename: string) {
  return fs.copy(resolve(TEMPLATE_DIR, filename), resolve(CWD, filename));
}
export default function () {
  const creator = new Creator("test", process.cwd());
  creator.create();
  // 拷贝.editorconfig
  // copy(".editorconfig");
  // copy(".eslintignore");
  // copy(".eslintrc.js");
  // copy("postcss.config.js");
  // copy("tsconfig.json");
  // copy("vite.config.ts");
}
