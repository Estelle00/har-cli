import {
  Component,
  inject,
  InjectionKey,
  markRaw,
  nextTick,
  reactive,
  readonly,
} from "vue";
import { pathToFile } from "./utils";
import theme from "/@theme/index";
export interface Route {
  path: string;
  data: Record<string, any>;
  component: Component | null;
}
export interface Router {
  route: Route;
  go: (href?: string) => Promise<void>;
}
export const RouterSymbol: InjectionKey<Router> = Symbol();
const getDefaultRoute = (): Route => ({
  path: "/",
  component: null,
  data: {},
});
const fakeHost = `https://huianrong.cn`;
interface PageModule {
  __pageData: Record<string, any>;
  default: Component;
}
function loadPageModule(path: string): PageModule | Promise<PageModule> {
  const pageFilePath = pathToFile(path);
  return import(/*@vite-ignore*/ pageFilePath);
}

export function createRouter() {
  const route = reactive(getDefaultRoute());

  function go(href: string = location.href) {
    // ensure correct deep link so page refresh lands on correct files.
    const url = new URL(href, fakeHost);
    const match = url.pathname.match(/(readme(.html)?)$/);
    if (match) {
      url.pathname = url.pathname.replace(match[1], "");
    } else if (!url.pathname.endsWith("/") && !url.pathname.endsWith(".html")) {
      url.pathname += ".html";
    }
    href = url.pathname + url.search + url.hash;
    history.replaceState({ scrollPosition: window.scrollY }, document.title);
    history.pushState(null, "", href);
    return loadPage(href);
  }

  let latestPendingPath: string | null = null;
  async function loadPage(href: string, scrollPosition = 0) {
    const targetLoc = new URL(href, fakeHost);
    const pendingPath = (latestPendingPath = targetLoc.pathname);
    try {
      let page = loadPageModule(pendingPath);
      // only await if it returns a Promise - this allows sync resolution
      // on initial render in SSR.
      if ("then" in page && typeof page.then === "function") {
        page = await page;
      }
      console.log(page);
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;

        const { default: comp, __pageData } = page as PageModule;
        if (!comp) {
          throw new Error(`Invalid route component: ${comp}`);
        }

        route.path = pendingPath;
        route.component = markRaw(comp);
        route.data = import.meta.env.PROD
          ? markRaw(__pageData)
          : readonly(__pageData);
        nextTick(() => {
          if (targetLoc.hash && !scrollPosition) {
            let target: HTMLElement | null = null;
            try {
              target = document.querySelector(
                decodeURIComponent(targetLoc.hash)
              ) as HTMLElement;
            } catch (e) {
              console.warn(e);
            }
            if (target) {
              scrollTo(target, targetLoc.hash);
              return;
            }
          }
          window.scrollTo(0, scrollPosition);
        });
      }
    } catch (err: any) {
      if (!err.message.match(/fetch/)) {
        console.error(err);
      }
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;
        route.path = pendingPath;
        route.component = markRaw(theme.NotFound || (() => "404 Not Found"));
      }
    }
  }

  window.addEventListener(
    "click",
    (e) => {
      const link = (e.target as Element).closest("a");
      if (link) {
        const { href, protocol, hostname, pathname, hash, target } = link;
        const currentUrl = window.location;
        const extMatch = pathname.match(/\.\w+$/);
        // only intercept inbound links
        if (
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey &&
          !e.metaKey &&
          target !== `_blank` &&
          protocol === currentUrl.protocol &&
          hostname === currentUrl.hostname &&
          !(extMatch && extMatch[0] !== ".html")
        ) {
          e.preventDefault();
          if (pathname === currentUrl.pathname) {
            // scroll between hash anchors in the same page
            if (hash && hash !== currentUrl.hash) {
              history.pushState(null, "", hash);
              // still emit the event so we can listen to it in themes
              window.dispatchEvent(new Event("hashchange"));
              // use smooth scroll when clicking on header anchor links
              scrollTo(link, hash, link.classList.contains("header-anchor"));
            }
          } else {
            go(href);
          }
        }
      }
    },
    { capture: true }
  );

  window.addEventListener("popstate", (e) => {
    loadPage(location.href, (e.state && e.state.scrollPosition) || 0);
  });

  window.addEventListener("hashchange", (e) => {
    e.preventDefault();
  });

  return {
    route,
    go,
  };
}

function scrollTo(el: HTMLElement, hash: string, smooth = false) {
  let target: Element | null = null;

  try {
    target = el.classList.contains(".header-anchor")
      ? el
      : document.querySelector(decodeURIComponent(hash));
  } catch (e) {
    console.warn(e);
  }
  if (target) {
    const targetTop = (target as HTMLElement).offsetTop;
    // only smooth scroll if distance is smaller than screen height.
    if (!smooth || Math.abs(targetTop - window.scrollY) > window.innerHeight) {
      window.scrollTo(0, targetTop);
    } else {
      window.scrollTo({
        left: 0,
        top: targetTop,
        behavior: "smooth",
      });
    }
  }
}
export function useRouter(): Router {
  const router = inject(RouterSymbol);
  if (!router) {
    throw new Error("useRouter() is called without provider.");
  }
  return router;
}
export function useRoute(): Route {
  return useRouter().route;
}
