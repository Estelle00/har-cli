import { createApp as createClientApp, h, onMounted, watch } from "vue";
import { createRouter, RouterSymbol } from "./router";
import { dataSymbol, initData, siteDataRef, useData } from "./data";
import { Content } from "./components/content";
import Theme from "/@theme/index";
const docApp = {
  name: "docApp",
  setup() {
    const { site } = useData();
    onMounted(() => {
      watch(
        () => site.value.lang,
        (lang) => {
          document.documentElement.lang = lang;
        },
        {
          immediate: true,
        }
      );
    });
    return () => h(Theme.Layout);
  },
};
console.log(import.meta.env);

function createApp() {
  const app = createClientApp(docApp);
  const router = createRouter();
  app.provide(RouterSymbol, router);
  const data = initData(router.route);
  app.provide(dataSymbol, data);
  app.component(Content.name, Content);
  Object.defineProperty(app.config.globalProperties, "$frontmatter", {
    get() {
      return data.frontmatter.value;
    },
  });
  if (Theme.enhanceApp) {
    Theme.enhanceApp({
      app,
      router,
      siteData: siteDataRef,
    });
  }

  return { app, router };
}
const { app, router } = createApp();
router.go().then(() => {
  app.mount("#app");
});
