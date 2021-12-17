import { resolvePkg } from "../../utils/pkg";
// import { writeFileTree } from "../../utils/writeFileTree";
import { createRequire } from "module";
import path from "path";
import { MODULE_PATH } from "../../config";
import Generator from "./Generator";
export default class Creator {
  constructor(public readonly name: string, public readonly context: string) {}
  async create() {
    const { name, context } = this;
    const pkg = {
      name,
      version: "0.0.0",
      private: true,
      devDependencies: {},
      ...resolvePkg(context),
    };
    const rawPlugins = {
      eslint: {},
    };
    // const d = createRequire(path.resolve(context, "package.json"));
    // console.log(d);
    const plugins = this.resolvePlugins(rawPlugins);
    const generator = new Generator(context, { plugins, pkg });
    // console.log(generator);
    // writeFileTree(context, {
    //   "package.json": JSON.stringify(pkg, null, 2),
    // });
  }
  resolvePlugins(rawPlugins: Record<string, any>) {
    return Object.keys(rawPlugins).map((id) => {
      const apply = import(`./plugins/${id}/generator.js`);
      return {
        id,
        apply,
        options: rawPlugins[id] || {},
      };
    });
  }
}
