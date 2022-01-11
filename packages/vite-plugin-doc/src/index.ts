import type { Plugin } from "vite";
import { getCache } from "./cache";
import {
  createMarkdownToVueRender,
  MarkdownCompileResult,
} from "./markdownToVue";
import { getVirtualPath, isDemoMarkdown, isVirtualModule } from "./utils";

const scriptClientRE = /<script\b[^>]*client\b[^>]*>([^]*?)<\/script>/;

const processClientJS = (code: string, id: string) => {
  return scriptClientRE.test(code)
    ? code.replace(scriptClientRE, (_) => {
        return `\n`.repeat(_.split("\n").length - 1);
      })
    : code;
};
export interface Options {
  srcDir?: string;
}
export default function createVueDoc(options: Options = {}): Plugin {
  const { srcDir } = Object.assign(
    {
      srcDir: process.cwd(),
    },
    options
  );

  let markdownToVue: (src: string, file: string) => MarkdownCompileResult;
  let vuePlugin: Plugin | undefined;
  return {
    name: "vite:vue-doc",
    enforce: "pre",
    configResolved(resolverConfig) {
      vuePlugin = resolverConfig.plugins.find((p) => p.name === "vite:vue");
      markdownToVue = createMarkdownToVueRender(srcDir);
    },
    resolveId(id: string) {
      if (isVirtualModule(id)) return id;
      return null;
    },
    load(id) {
      if (isVirtualModule(id)) {
        return getCache(id);
      }
      return null;
    },
    transform(code, id) {
      if (id.endsWith(".vue")) return processClientJS(code, id);
      if (!id.endsWith(".md")) return null;
      if (!vuePlugin) return this.error("没有找到[vite:vue]插件");
      let _code = code;
      if (!isVirtualModule(id)) {
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
      if (!ctx.file.endsWith(".md") || !vuePlugin) {
        return undefined;
      }
      const { file, read, server, timestamp, modules } = ctx;
      const content = await read();
      const updated = [];
      const { vueSrc } = markdownToVue(content, file);
      const isDemo = isDemoMarkdown(file);
      if (isDemo) {
        const virtualDemoPath = getVirtualPath(file);
        const mods = server.moduleGraph.getModulesByFile(virtualDemoPath);
        console.log(virtualDemoPath);
        if (mods) {
          const ret = await vuePlugin.handleHotUpdate?.({
            file: virtualDemoPath,
            timestamp,
            modules: [...mods],
            server,
            read: () => getCache(virtualDemoPath),
          });
          updated.push(...(ret || []));
        }
      }
      const ret = await vuePlugin.handleHotUpdate?.({
        file,
        timestamp,
        modules,
        server,
        read: () => vueSrc,
      });
      return [...updated, ...(ret || [])];
    },
  };
}
