export type HeadConfig =
  | [string, Record<string, string>]
  | [string, Record<string, string>, string];

// export interface PageData {
// relativePath: string;
// title: string;
// description: string;
// headers: Header[];
// frontmatter: Record<string, any>;
// lastUpdated: number;
// }

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
