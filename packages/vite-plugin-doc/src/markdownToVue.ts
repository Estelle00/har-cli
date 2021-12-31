import path from "node:path";
import { setCache } from "./cache";
import marked from "./marked";
import { pascalCase } from "change-case";
import { DemoVueType, getDemoVue, getMainVue } from "./vue-template";
import { getVirtualPath } from "./utils";

export function transformMain(tokens: any[], frontMatter: Record<string, any>) {
  const imports: string[] = [];
  const components: string[] = [];
  for (const token of tokens) {
    if (token.type === "fileImport") {
      const componentName = pascalCase(`demo-${token.basename}`);
      components.push(componentName);
      imports.push(`import ${componentName} from ${token.filename}`);
    }
  }
  const html = marked.parser(tokens);
  return getMainVue({ html, imports, components, data: frontMatter });
}

export function transformDemo(
  tokens: any[],
  filename: string,
  frontMatter?: Record<string, any>
) {
  const basename = path.basename(filename, ".md");
  const virtualPath = getVirtualPath(filename);
  const data: DemoVueType = {
    id: basename,
    title: frontMatter?.title || "",
    description: frontMatter?.description || "",
    virtualPath,
    code: "",
  };
  for (const token of tokens) {
    if (token.type === "code" && token.lang === "vue") {
      setCache(virtualPath, token.text);
      data.code = marked.parser([token]);
    }
  }
  return getDemoVue(data);
}
