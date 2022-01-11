import { Theme } from "@har/doc";
import Layout from "./Layout.vue";
import NotFound from "./NotFound.vue";
import "@arco-design/web-vue/dist/arco.less";
import ArcoVue from "@arco-design/web-vue";
import ArcoIcon from "@arco-design/web-vue/es/icon";
import "./style/index.less";
import "prismjs/themes/prism-tomorrow.css";
import CellDemo from "./components/cell-demo/index.vue";
import CodeBlock from "./components/code-block/index.vue";
import CellCode from "./components/cell-code/index.vue";
import DocArticle from "./components/doc-article/index.vue";

const theme: Theme = {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.component(CellDemo.name, CellDemo);
    app.component(CodeBlock.name, CodeBlock);
    app.component(CellCode.name, CellCode);
    app.component(DocArticle.name, DocArticle);
    app.use(ArcoVue);
    app.use(ArcoIcon);
  },
};
export default theme;
