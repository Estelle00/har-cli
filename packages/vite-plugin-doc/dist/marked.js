"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const marked_1 = require("marked");
const compiler_sfc_1 = require("@vue/compiler-sfc");
const prismjs_1 = __importDefault(require("prismjs"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const index_1 = __importDefault(require("prismjs/components/index"));
const node_path_1 = __importDefault(require("node:path"));
const change_case_1 = require("change-case");
const markHelpers_1 = require("./markHelpers");
const languages = ["shell", "js", "ts", "jsx", "tsx", "less", "java"];
(0, index_1.default)(languages);
function loadHighlighted(code, lang) {
    return prismjs_1.default.highlight(code, prismjs_1.default.languages[lang], lang);
}
marked_1.marked.setOptions({
    highlight(code, lang) {
        var _a;
        if (lang === "vue") {
            const { descriptor } = (0, compiler_sfc_1.parse)(code);
            const { script, styles } = descriptor;
            let htmlContent = code;
            const hasStyles = styles.length > 0;
            if (script === null || script === void 0 ? void 0 : script.content) {
                htmlContent = htmlContent.replace(script.content, "$script$");
            }
            if (hasStyles) {
                styles.forEach((style, index) => {
                    htmlContent = htmlContent.replace(style.content, `$style-${index}$`);
                });
            }
            let highlighted = loadHighlighted(htmlContent, "html");
            if (script === null || script === void 0 ? void 0 : script.content) {
                const lang = (_a = script.lang) !== null && _a !== void 0 ? _a : "js";
                const highlightedScript = loadHighlighted(script.content, lang);
                highlighted = highlighted.replace("$script$", highlightedScript);
            }
            if (hasStyles) {
                styles.forEach((style, index) => {
                    var _a;
                    const lang = (_a = style.lang) !== null && _a !== void 0 ? _a : "css";
                    const highlightedStyle = loadHighlighted(style.content, lang);
                    highlighted = highlighted.replace(`$style-${index}$`, highlightedStyle);
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
function getContent(code, lang) {
    return `<pre class="code-content language-${lang}"><code>${code}</code></pre>\n`;
}
const fileImport = {
    name: "fileImport",
    level: "block",
    tokenizer(src) {
        const rule = /^@import\s+(.+)(?:\n|$)/;
        const match = rule.exec(src);
        if (match) {
            const filename = match[1].trim();
            const basename = node_path_1.default.basename(filename, ".md");
            return {
                type: "fileImport",
                raw: match[0],
                filename,
                basename,
            };
        }
    },
    renderer(token) {
        const Component = (0, change_case_1.paramCase)(`demo-` + token.basename);
        return `<${Component} />\n`;
    },
};
const frontMatter = {
    name: "frontMatter",
    level: "block",
    tokenizer(src) {
        const { data, content } = (0, gray_matter_1.default)(src);
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
marked_1.marked.use({
    breaks: true,
    xhtml: true,
    renderer: {
        code(code, language = "") {
            var _a;
            const lang = (_a = language.match(/\S*/)) === null || _a === void 0 ? void 0 : _a[0];
            // @ts-ignore
            if (this.options.highlight) {
                // @ts-ignore
                const out = this.options.highlight(code, lang || "");
                if (out !== null && out !== code)
                    code = out;
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
        table(header, body) {
            return `<a-table class="component-api-table">
  <colgroup><col style="min-width: 100px"></colgroup>
  <a-thead>${header}</a-thead>
  <a-tbody>${body}</a-tbody>
</a-table>`;
        },
        tablerow(content) {
            return `<a-tr>${content}</a-tr>`;
        },
        tablecell(content, { header }) {
            if (header) {
                return `<a-th>${content}</a-th>`;
            }
            return `<a-td>${content}</a-td>`;
        },
        link(href, title, text) {
            // @ts-ignore
            href = (0, markHelpers_1.cleanUrl)(this.options.sanitize, this.options.baseUrl, href);
            if (href === null) {
                return text;
            }
            let out = `<a class="link" href="${(0, markHelpers_1.escape)(href)}"`;
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
    // [ts提示错误](https://marked.js.org/using_pro#extensions)
    // @ts-ignore
    extensions: [frontMatter, fileImport],
});
exports.default = marked_1.marked;
