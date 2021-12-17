import { join, resolve } from "path";
export const OUT_DIR = "dist";
export const CWD = process.cwd();
export const OUT_DIR_ES = join(OUT_DIR, "es");
export const OUT_DIR_LIB = join(OUT_DIR, "lib");
export const MODULE_PATH = resolve(__dirname, "../../");
export const TEMPLATE_DIR = resolve(MODULE_PATH, "template");
