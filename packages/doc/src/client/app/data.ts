import { Route } from "./router";
import serializedSiteData from "@siteData";
import { SiteData } from "../../types";
import { computed, inject, InjectionKey, readonly, Ref, shallowRef } from "vue";
export const siteDataRef: Ref<SiteData> = shallowRef(
  readonly(serializedSiteData) as SiteData
);

interface InitData {
  site: Ref<SiteData>;
  frontmatter: Ref<Record<string, any>>;
  title: Ref<string>;
  description: Ref<string>;
}
export const dataSymbol: InjectionKey<InitData> = Symbol();
// hmr
if (import.meta.hot) {
  import.meta.hot!.accept("@siteData", (m) => {
    siteDataRef.value = m.default;
  });
}

export function initData(route: Route) {
  const site = siteDataRef;
  return {
    site,
    frontmatter: computed(() => route.data),
    title: computed(() => {
      const { title } = route.data;
      return title ? title + " | " + site.value.title : site.value.title;
    }),
    description: computed(
      () => route.data.description || site.value.description
    ),
  } as const;
}
export function useData(): InitData {
  const data = inject(dataSymbol);
  if (!data) {
    throw new Error("vitepress data not properly injected in app");
  }
  return data;
}
