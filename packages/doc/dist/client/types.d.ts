export declare type HeadConfig = [string, Record<string, string>] | [string, Record<string, string>, string];
export interface Header {
    level: number;
    title: string;
    slug: string;
}
export interface SiteData<ThemeConfig = any> {
    base: string;
    /**
     * Language of the site as it should be set on the `html` element.
     * @example `en-US`, `zh-CN`
     */
    lang: string;
    title: string;
    description: string;
    head: HeadConfig[];
    themeConfig: ThemeConfig;
}
