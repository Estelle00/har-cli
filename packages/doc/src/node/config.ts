import path from "node:path";
import {
  loadConfigFromFile,
  mergeConfig,
  normalizePath,
  UserConfig as ViteConfig,
} from "vite";
import { HeadConfig } from "../shared";
import { Options as VuePluginOptions } from "@vitejs/plugin-vue";
import fs from "fs-extra";
type CommandType = "serve" | "build";

export async function resolveConfig(
  root: string = process.cwd(),
  command: CommandType = "serve",
  mode = "development"
) {
  const [useConfig, configPath] = await resolveUserConfig(root, command, mode);
  const site = await resolveSiteData(root, useConfig);
}
const resolve = (root: string, file: string) =>
  normalizePath(path.resolve(root, `.doc`, file));
const supportedConfigExtensions = ["js", "ts", ".mjs", "mts"];
async function getFileConfig(
  configPath: string | undefined,
  root: string,
  command: CommandType,
  mode: string
) {
  if (configPath) {
    const data = await loadConfigFromFile(
      {
        command,
        mode,
      },
      configPath,
      root
    );
    if (data && data.config) {
      return data.config;
    }
  }
  return {};
}
async function resolveUserConfig(
  root: string,
  command: CommandType,
  mode: string
): Promise<[UserConfig, string | undefined]> {
  let configPath;
  for (const ext of supportedConfigExtensions) {
    const p = resolve(root, `config.${ext}`);
    if (fs.pathExistsSync(p)) {
      configPath = p;
      break;
    }
  }
  const userConfig = await getFileConfig(configPath, root, command, mode);
  return [await resolveConfigExtends(userConfig), configPath];
}
export interface UserConfig<ThemeConfig = any> {
  extends?: RawConfigExports;
  lang?: string;
  base?: string;
  title?: string;
  description?: string;
  head?: HeadConfig[];
  themeConfig?: ThemeConfig;
  /**
   * Opitons to pass on to `@vitejs/plugin-vue`
   */
  vue?: VuePluginOptions;
  /**
   * Vite config
   */
  vite?: ViteConfig;

  srcDir?: string;
  srcExclude?: string[];
  shouldPreload?: (link: string, page: string) => boolean;

  /**
   * Enable MPA / zero-JS mode
   * @experimental
   */
  mpa?: boolean;
}
export type RawConfigExports =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);
async function resolveConfigExtends(
  config: RawConfigExports
): Promise<UserConfig> {
  const resolved = await (typeof config === "function" ? config() : config);
  if (resolved.extends) {
    const base = await resolveConfigExtends(resolved.extends);
    return mergeConfig(base, resolved);
  }
  return resolved;
}

export function resolveSiteData(root: string, userConfig: UserConfig) {
  return {
    lang: userConfig.lang || "en-US",
    title: userConfig.title || "VitePress",
    description: userConfig.description || "A VitePress site",
    base: userConfig.base ? userConfig.base.replace(/([^/])$/, "$1/") : "/",
    head: userConfig.head || [],
    themeConfig: userConfig.themeConfig || {},
  };
}
