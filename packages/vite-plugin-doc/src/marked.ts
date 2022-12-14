import { marked } from "marked";
import { parse } from "@vue/compiler-sfc";
import Prism from "prismjs";
import matter from "gray-matter";
import loadLanguages from "prismjs/components/index";
import path from "node:path";
import { paramCase } from "change-case";
import { cleanUrl, escape } from "./markHelpers";
const languages = ["shell", "js", "ts", "jsx", "tsx", "less", "java"];
loadLanguages(languages);

function loadHighlighted(code: string, lang: string) {
  return Prism.highlight(code, Prism.languages[lang], lang);
}
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
    table(header: string, body: string) {
      return `<a-table class="component-api-table">
  <colgroup><col style="min-width: 100px"></colgroup>
  <a-thead>${header}</a-thead>
  <a-tbody>${body}</a-tbody>
</a-table>`;
    },
    tablerow(content) {
      return `<a-tr>${content}</a-tr>`;
    },
    tablecell(content: string, { header }) {
      if (header) {
        return `<a-th>${content}</a-th>`;
      }
      return `<a-td>${content}</a-td>`;
    },
    link(href, title, text) {
      // @ts-ignore
      href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
      if (href === null) {
        return text;
      }
      let out = `<a class="link" href="${escape(href)}"`;
      if (title) {
        if (/_blank/.test(title)) {
          out += " target='_blank'";
          title = title.replace("_blank", "").trim();
        }
        if (title) {
          out += ` title=${title}`;
        }
      }
      out += `>${text}</a>`;
      return out;
    },
  },
  // [ts????????????](https://marked.js.org/using_pro#extensions)
  // @ts-ignore
  extensions: [frontMatter, fileImport],
});
export default marked;
