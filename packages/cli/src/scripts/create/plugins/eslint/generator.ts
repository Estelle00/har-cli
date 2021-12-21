import type GeneratorAPI from "../../GeneratorAPI";
export default (api: GeneratorAPI, options?: Record<string, any>) => {
  api.extendPackage({
    vue: "^3",
  });
  api.render("../template");
};
