import { marked } from "marked";
import { parse } from "@vue/compiler-sfc";
import Prism from "prismjs";
import matter from "gray-matter";
import loadLanguages from "prismjs/components/index";
import path from "node:path";
import { paramCase } from "change-case";
const languages = ["shell", "js", "ts", "jsx", "tsx", "less"];
loadLanguages(languages);
function loadHighlighted(code: string, lang: string) {
  return Prism.highlight(code, Prism.languages[lang], lang);
}
//
// function highlight(code: string, lang: string): string {
//   if (lang === "vue") {
//     const { descriptor } = parse(code);
//     const { script, styles } = descriptor;
//     let htmlContent = code;
//     const hasStyles = styles.length > 0;
//     if (script?.content) {
//       htmlContent = htmlContent.replace(script.content, "$script$");
//     }
//     if (hasStyles) {
//       styles.forEach((style, index) => {
//         htmlContent = htmlContent.replace(style.content, `$style-${index}$`);
//       });
//     }
//     let highlighted = loadHighlighted(htmlContent, "html");
//     if (script?.content) {
//       const lang = script.lang ?? "js";
//       const highlightedScript = loadHighlighted(script.content, lang);
//       highlighted = highlighted.replace("$script$", highlightedScript);
//     }
//     if (hasStyles) {
//       styles.forEach((style, index) => {
//         const lang = style.lang ?? "css";
//         const highlightedStyle = loadHighlighted(style.content, lang);
//         highlighted = highlighted.replace(`$style-${index}$`, highlightedStyle);
//       });
//     }
//     return highlighted;
//   }
//   if (languages.includes(lang)) {
//     return loadHighlighted(code, lang);
//   }
//   return code;
// }

marked.setOptions({
  highlight(code: string, lang: string): string | void {
    if (lang === "vue") {
      const { descriptor } = parse(code);
      const { script, styles } = descriptor;
      let htmlContent = code;
      const hasStyles = styles.length > 0;
      if (script?.content) {
        htmlContent = htmlContent.replace(script.content, "$script$");
      }
      if (hasStyles) {
        styles.forEach((style, index) => {
          htmlContent = htmlContent.replace(style.content, `$style-${index}$`);
        });
      }
      let highlighted = loadHighlighted(htmlContent, "html");
      if (script?.content) {
        const lang = script.lang ?? "js";
        const highlightedScript = loadHighlighted(script.content, lang);
        highlighted = highlighted.replace("$script$", highlightedScript);
      }
      if (hasStyles) {
        styles.forEach((style, index) => {
          const lang = style.lang ?? "css";
          const highlightedStyle = loadHighlighted(style.content, lang);
          highlighted = highlighted.replace(
            `$style-${index}$`,
            highlightedStyle
          );
        });
      }
      return highlighted;
    }
    if (languages.includes(lang)) {
      return loadHighlighted(code, lang);
    }
    return code;
  },
});
function getContent(code: string, lang?: string) {
  return `<pre class="code-content language-${lang}"><code>${code}</code></pre>\n`;
}
interface FileImportToken {
  type: "fileImport";
  raw: string;
  filename: string;
  basename: string;
}
const fileImport = {
  name: "fileImport",
  level: "block",
  tokenizer(src: string) {
    const rule = /^@import\s+(.+)(?:\n|$)/;
    const match = rule.exec(src);
    if (match) {
      const filename = match[1].trim();
      const basename = path.basename(filename, ".md");
      return {
        type: "fileImport",
        raw: match[0],
        filename,
        basename,
      };
    }
  },
  renderer(token: FileImportToken) {
    const Component = paramCase(`demo-` + token.basename);
    return `<${Component} />\n`;
  },
};
const frontMatter = {
  name: "frontMatter",
  level: "block",
  tokenizer(src: string) {
    const { data, content } = matter(src);
    if (Object.keys(data).length) {
      return {
        type: "frontMatter",
        raw: src.replace(content, ""),
        data,
      };
    }
  },
  renderer() {
    return "";
  },
};
marked.use({
  breaks: true,
  xhtml: true,
  renderer: {
    code(code, language = "") {
      const lang = language.match(/\S*/)?.[0];
      // @ts-ignore
      if (this.options.highlight) {
        // @ts-ignore
        const out = this.options.highlight(code, lang || "");
        if (out !== null && out !== code) code = out;
      }
      code = code.replace(/{{|}}/g, (str) => {
        if (str === "{{") {
          return "&#123;&#123;";
        }
        return "&#125;&#125;";
      });
      code = `${code.replace(/\n$/, "")}\n`;
      // @ts-ignore
      return getContent(code, lang);
    },
  },
  // [ts提示错误](https://marked.js.org/using_pro#extensions)
  // @ts-ignore
  extensions: [frontMatter, fileImport],
});
export default marked;
