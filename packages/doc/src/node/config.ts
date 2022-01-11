import path from "node:path";
import {
  loadConfigFromFile,
  mergeConfig,
  normalizePath,
  UserConfig as ViteConfig,
  AliasOptions,
} from "vite";
import { Options as VuePluginOptions } from "@vitejs/plugin-vue";
import fs from "fs-extra";
import { HeadConfig, SiteData } from "../types";
import { DEFAULT_THEME_PATH, resolveAliases } from "./alias";
import globby from "globby";
type CommandType = "serve" | "build";

export interface SiteConfig<ThemeConfig = any>
  extends Pick<UserConfig, "vue" | "vite"> {
  root: string;
  srcDir: string;
  site: SiteData<ThemeConfig>;
  configPath: string | undefined;
  themeDir: string;
  outDir: string;
  tempDir: string;
  alias: AliasOptions;
  pages: string[];
}
function getThemeDir(root: string = process.cwd()) {
  const userThemeDir = resolve(root, "theme");
  if (fs.pathExistsSync(userThemeDir)) {
    return userThemeDir;
  }
  return DEFAULT_THEME_PATH;
}

export async function resolveConfig(
  root: string = process.cwd(),
  command: CommandType = "serve",
  mode = "development"
): Promise<SiteConfig> {
  const [useConfig, configPath] = await resolveUserConfig(root, command, mode);
  const site = resolveSiteData(root, useConfig);
  const srcDir = path.resolve(root, useConfig.srcDir || ".");
  const outDir = useConfig.outDir
    ? path.resolve(root, useConfig.outDir)
    : resolve(root, "dist");
  const themeDir = getThemeDir(root);
  console.log(themeDir);
  const pages = (
    await globby(["**.md"], {
      cwd: srcDir,
      ignore: [
        "**/node_modules",
        ...(useConfig.srcExclude || ["**/__demo__/**"]),
      ],
    })
  ).sort();
  return {
    root,
    srcDir,
    site,
    configPath,
    themeDir,
    outDir,
    tempDir: "",
    pages,
    alias: resolveAliases(themeDir),
    vue: useConfig.vue,
    vite: useConfig.vite,
  };
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
  outDir?: string;
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
    base: userConfig.base ? userConfig.base.replace(/([^/])$/, "$1/") : "/",
    lang: userConfig.lang || "zh-CN",
    title: userConfig.title || "vue-doc",
    description: userConfig.description || "A vue doc site",
    head: userConfig.head || [],
    themeConfig: userConfig.themeConfig || {},
  } as const;
}
