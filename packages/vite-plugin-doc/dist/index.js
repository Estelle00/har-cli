"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("./cache");
const markdownToVue_1 = require("./markdownToVue");
const utils_1 = require("./utils");
const scriptClientRE = /<script\b[^>]*client\b[^>]*>([^]*?)<\/script>/;
const processClientJS = (code, id) => {
    return scriptClientRE.test(code)
        ? code.replace(scriptClientRE, (_) => {
            return `\n`.repeat(_.split("\n").length - 1);
        })
        : code;
};
function createVueDoc(options = {}) {
    const { srcDir } = Object.assign({
        srcDir: process.cwd(),
    }, options);
    let markdownToVue;
    let vuePlugin;
    return {
        name: "vite:vue-doc",
        enforce: "pre",
        configResolved(resolverConfig) {
            vuePlugin = resolverConfig.plugins.find((p) => p.name === "vite:vue");
            markdownToVue = (0, markdownToVue_1.createMarkdownToVueRender)(srcDir);
        },
        resolveId(id) {
            if ((0, utils_1.isVirtualModule)(id))
                return id;
            return null;
        },
        load(id) {
            if ((0, utils_1.isVirtualModule)(id)) {
                return (0, cache_1.getCache)(id);
            }
            return null;
        },
        transform(code, id) {
            if (id.endsWith(".vue"))
                return processClientJS(code, id);
            if (!id.endsWith(".md"))
                return null;
            if (!vuePlugin)
                return this.error("没有找到[vite:vue]插件");
            let _code = code;
            if (!(0, utils_1.isVirtualModule)(id)) {
                const { vueSrc } = markdownToVue(code, id);
                _code = vueSrc;
                // if (includes.length > 0) {
                //   includes.forEach((i) => {
                //     this.addWatchFile(i);
                //   });
                // }
            }
            return processClientJS(_code, id);
        },
        async handleHotUpdate(ctx) {
            var _a, _b;
            if (!ctx.file.endsWith(".md") || !vuePlugin) {
                return undefined;
            }
            const { file, read, server, timestamp, modules } = ctx;
            const content = await read();
            const updated = [];
            const { vueSrc } = markdownToVue(content, file);
            const isDemo = (0, utils_1.isDemoMarkdown)(file);
            if (isDemo) {
                const virtualDemoPath = (0, utils_1.getVirtualPath)(file);
                const mods = server.moduleGraph.getModulesByFile(virtualDemoPath);
                console.log(virtualDemoPath);
                if (mods) {
                    const ret = await ((_a = vuePlugin.handleHotUpdate) === null || _a === void 0 ? void 0 : _a.call(vuePlugin, {
                        file: virtualDemoPath,
                        timestamp,
                        modules: [...mods],
                        server,
                        read: () => (0, cache_1.getCache)(virtualDemoPath),
                    }));
                    updated.push(...(ret || []));
                }
            }
            const ret = await ((_b = vuePlugin.handleHotUpdate) === null || _b === void 0 ? void 0 : _b.call(vuePlugin, {
                file,
                timestamp,
                modules,
                server,
                read: () => vueSrc,
            }));
            return [...updated, ...(ret || [])];
        },
    };
}
exports.default = createVueDoc;
