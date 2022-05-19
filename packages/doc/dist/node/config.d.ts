import { UserConfig as ViteConfig, AliasOptions } from "vite";
import { Options as VuePluginOptions } from "@vitejs/plugin-vue";
import { HeadConfig, SiteData } from "../client/types";
declare type CommandType = "serve" | "build";
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
export interface SiteConfig<ThemeConfig = any> extends Pick<UserConfig, "vue" | "vite"> {
    root: string;
    srcDir: string;
    site: SiteData<ThemeConfig>;
    configPath: string | undefined;
    themeDir: string;
    outDir: string;
    tempDir: string;
    alias: AliasOptions;
    srcExclude: string[];
    pages: string[];
}
export declare function resolveConfig(root?: string, command?: CommandType, mode?: string): Promise<SiteConfig>;
export declare type RawConfigExports = UserConfig | Promise<UserConfig> | (() => UserConfig | Promise<UserConfig>);
export declare function resolveSiteData(root: string, userConfig: UserConfig): {
    readonly base: string;
    readonly lang: string;
    readonly title: string;
    readonly description: string;
    readonly head: HeadConfig[];
    readonly themeConfig: any;
};
export {};
