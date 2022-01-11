import { SiteConfig } from "./config";
import { defineConfig, mergeConfig, Plugin } from "vite";
import { APP_PATH, DIST_CLIENT_PATH, SITE_DATA_PATH } from "./alias";

export function createDocPlugin(root: string, siteConfig: SiteConfig) {
  const {
    configPath,
    site,
    vue: userVuePluginOptions,
    vite: userViteConfig,
    alias,
    srcDir,
  } = siteConfig;
  const vuePlugin = require("@vitejs/plugin-vue")({
    include: [/\.vue$/, /\.md$/],
    ...userVuePluginOptions,
  });
  const viteDocPlugin: Plugin = {
    name: "vue-doc",
    resolveId(id) {
      if (id === SITE_DATA_PATH) {
        return id;
      }
    },
    config() {
      const baseConfig = defineConfig({
        resolve: {
          alias,
        },
        server: {
          fs: {
            allow: [DIST_CLIENT_PATH, srcDir, process.cwd()],
          },
        },
      });
      return userViteConfig
        ? mergeConfig(userViteConfig, baseConfig)
        : baseConfig;
    },
    load(id) {
      if (id === SITE_DATA_PATH) {
        return `export default ${JSON.stringify(site)}`;
      }
    },
    configureServer(server) {
      if (configPath) {
        server.watcher.add(configPath);
      }
      return () => {
        server.middlewares.use((req, res, next) => {
          if (req.url!.endsWith(".html")) {
            res.statusCode = 200;
            res.end(`<!DOCTYPE html>
            <html>
              <head>
                <title></title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <meta name="description" content="">
              </head>
              <body>
                <div id="app"></div>
                <script type="module" src="/@fs/${APP_PATH.replace(
                  /\\/g,
                  "/"
                )}/index.ts"></script>
              </body>
            </html>`);
            return;
          }
          next();
        });
      };
    },
  };
  //
  const vueDoc = require("@har/vite-plugin-doc").default({ srcDir });
  return [vuePlugin, vueDoc, viteDocPlugin];
}
