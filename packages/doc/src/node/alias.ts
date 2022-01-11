import path from "node:path";
import { AliasOptions } from "vite";
const PKG_ROOT = path.join(__dirname, "../../");
export const DIST_CLIENT_PATH = path.join(__dirname, "../client");
export const APP_PATH = path.join(DIST_CLIENT_PATH, "app");
export const SITE_DATA_ID = "@siteData";
export const SITE_DATA_PATH = "/" + SITE_DATA_ID;
console.log(DIST_CLIENT_PATH);
export const DEFAULT_THEME_PATH = path.join(DIST_CLIENT_PATH, "theme-default");
export function resolveAliases(themeDir: string): AliasOptions {
  const paths: Record<string, string> = {
    "/@theme": themeDir,
    [SITE_DATA_ID]: SITE_DATA_PATH,
  };
  return [
    ...Object.keys(paths).map((p) => ({
      find: p,
      replacement: paths[p],
    })),
    {
      find: /^@har\/doc$/,
      replacement: path.join(__dirname, "../client/index"),
    },
    { find: /^@har\/doc\//, replacement: PKG_ROOT + "/" },
    {
      find: /^@har\/doc\/theme$/,
      replacement: path.join(__dirname, "../client/theme-default/index"),
    },
  ];
}
