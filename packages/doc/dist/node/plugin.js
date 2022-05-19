"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocPlugin = void 0;
const vite_1 = require("vite");
const alias_1 = require("./alias");
function createDocPlugin(root, siteConfig) {
    const { configPath, site, vue: userVuePluginOptions, vite: userViteConfig, alias, srcDir, } = siteConfig;
    const vuePlugin = require("@vitejs/plugin-vue")({
        include: [/\.vue$/, /\.md$/],
        ...userVuePluginOptions,
    });
    const viteDocPlugin = {
        name: "vue-doc",
        resolveId(id) {
            if (id === alias_1.SITE_DATA_PATH) {
                return id;
            }
        },
        config() {
            const baseConfig = (0, vite_1.defineConfig)({
                resolve: {
                    alias,
                },
                server: {
                    fs: {
                        allow: [alias_1.DIST_CLIENT_PATH, srcDir, process.cwd()],
                    },
                },
            });
            return userViteConfig
                ? (0, vite_1.mergeConfig)(userViteConfig, baseConfig)
                : baseConfig;
        },
        load(id) {
            if (id === alias_1.SITE_DATA_PATH) {
                return `export default ${JSON.stringify(site)}`;
            }
        },
        configureServer(server) {
            if (configPath) {
                server.watcher.add(configPath);
            }
            return () => {
                server.middlewares.use((req, res, next) => {
                    if (req.url.endsWith(".html")) {
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
                <script type="module" src="/@fs/${alias_1.APP_PATH.replace(/\\/g, "/")}/index.ts"></script>
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
exports.createDocPlugin = createDocPlugin;
