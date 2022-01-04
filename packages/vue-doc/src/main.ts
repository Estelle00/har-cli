import "@arco-design/web-vue/dist/arco.less";
import Arco from "@arco-design/web-vue";
import ArcoIcon from "@arco-design/web-vue/es/icon";
import App from "./app.vue";
import { createApp } from "vue";
import router from "@/router";
import "prismjs/themes/prism-tomorrow.css";
import CellDemo from "@/components/cell-demo/index.vue";
import CodeBlock from "@/components/code-block/index.vue";
import CellCode from "@/components/cell-code/index.vue";
async function run() {
  const app = createApp(App);
  app.component(CellDemo.name, CellDemo);
  app.component(CodeBlock.name, CodeBlock);
  app.component(CellCode.name, CellCode);
  app.use(Arco);
  app.use(ArcoIcon);
  app.use(router);
  await router.isReady();
  app.mount("#app");
}

run();
