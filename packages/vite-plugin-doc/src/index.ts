import type { Plugin, ResolvedConfig } from "vite";
import { getCache } from "./cache";
import marked from "./marked";
import { transformDemo, transformMain } from "./markdownToVue";
import { getVirtualPath, isVirtualModule } from "./utils";
function getVueId(id: string) {
  return id.replace(".md", ".vue");
}
function getFrontMatter(tokens: any[]) {
  for (const token of tokens) {
    if (token.type === "frontMatter") return token.data;
  }
  return undefined;
}
function isDemoMarkdown(id: string) {
  return /\/__demo__\//.test(id);
}

function getVueCode(id: string, code: string) {
  const tokens = marked.lexer(code);
  const frontMatter = getFrontMatter(tokens);
  return isDemoMarkdown(id)
    ? transformDemo(tokens, id, frontMatter)
    : transformMain(tokens, frontMatter);
}
export default function createVueDoc(): Plugin {
  let vuePlugin: Plugin | undefined;
  return {
    name: "vite:vue-doc",
    enforce: "pre",
    configResolved(resolverConfig) {
      vuePlugin = resolverConfig.plugins.find((p) => p.name === "vite:vue");
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
      if (!id.endsWith(".md")) return null;
      if (!vuePlugin) return this.error("没有找到[vite:vue]插件");
      let _code = code;
      if (!isVirtualModule(id)) {
        _code = getVueCode(id, code);
      }
      return vuePlugin.transform?.call(this, _code, getVueId(id));
    },
    async handleHotUpdate(ctx) {
      if (!ctx.file.endsWith(".md") || !vuePlugin) {
        return undefined;
      }
      const { file, read, timestamp, server, modules } = ctx;
      const { moduleGraph } = server;
      const content = await read();
      const updated = [];
      const component = getVueCode(file, content);
      const isDemo = isDemoMarkdown(file);
      if (isDemo) {
        const virtualPath = getVirtualPath(file);
        const mods = moduleGraph.getModulesByFile(virtualPath);
        if (mods) {
          const ret = await vuePlugin.handleHotUpdate?.({
            file: getVueId(virtualPath),
            timestamp,
            modules: [...mods],
            server,
            read: () => getCache(virtualPath),
          });
          updated.push(...(ret || []));
        }
      }
      const ret = await vuePlugin.handleHotUpdate?.({
        file: getVueId(file),
        timestamp,
        modules,
        server,
        read: () => component,
      });
      return [...updated, ...(ret || [])];
    },
  };
}
