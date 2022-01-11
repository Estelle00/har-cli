import path from "node:path";
import { setCache } from "./cache";
import marked from "./marked";
import { pascalCase } from "change-case";
import { DemoVueType, getDemoVue, getMainVue } from "./vue-template";
import { getFrontMatter, getVirtualPath, isDemoMarkdown } from "./utils";

export function transformMain(
  tokens: any[],
  file: string,
  frontMatter: Record<string, any>
) {
  const imports: string[] = [];
  const components: string[] = [];
  const includes: string[] = [];
  const dir = path.dirname(file);
  for (const token of tokens) {
    if (token.type === "fileImport") {
      const componentName = pascalCase(`demo-${token.basename}`);
      components.push(componentName);
      const includePath = path
        .join(dir, token.filename.replace(/"/g, ""))
        .toString();
      imports.push(`import ${componentName} from ${token.filename}`);
      includes.push(includePath);
    }
  }
  const html = marked.parser(tokens);
  const vueSrc = getMainVue({ html, imports, components, data: frontMatter });
  return {
    vueSrc,
    includes,
  };
}

export interface MarkdownCompileResult {
  vueSrc: string;
  includes: string[];
}

export function transformDemo(
  tokens: any[],
  filename: string,
  frontMatter?: Record<string, any>
) {
  const basename = path.basename(filename, ".md");
  const virtualPath = getVirtualPath(filename);
  let description = "";
  if (frontMatter?.description) {
    description = marked(frontMatter.description);
  }
  const data: DemoVueType = {
    id: basename,
    title: frontMatter?.title || "",
    description,
    virtualPath,
    code: "",
  };
  for (const token of tokens) {
    if (token.type === "blockquote") {
      data.description = marked(token.raw);
    } else if (token.type === "code" && token.lang === "vue") {
      setCache(virtualPath, token.text);
      data.code = marked.parser([token]);
    }
  }
  return { vueSrc: getDemoVue(data), includes: [] };
}

export function createMarkdownToVueRender(srcDir: string) {
  return (src: string, file: string) => {
    const tokens = marked.lexer(src);
    const frontMatter = getFrontMatter(tokens);
    return isDemoMarkdown(file)
      ? transformDemo(tokens, file, frontMatter)
      : transformMain(tokens, file, frontMatter);
  };
}
