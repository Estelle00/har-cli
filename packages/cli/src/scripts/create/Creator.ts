import { resolvePkg } from "../../utils/pkg";
import Generator from "./Generator";
import { loadModule } from "../../utils/module";
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
      "eslint-config": {},
    };
    const plugins = await this.resolvePlugins(rawPlugins);
    const generator = new Generator(context, { plugins, pkg });
    await generator.generate();
  }
  async resolvePlugins(rawPlugins: Record<string, any>) {
    const plugins = [];
    for (const id of Object.keys(rawPlugins)) {
      const moduleId = `@har/${id}/generator`;
      // const t = createRequire(path.resolve(this.context, "package.json"))(
      //   moduleId
      // );
      // console.log(t);
      const apply = loadModule(moduleId, this.context);
      plugins.push({
        apply,
        options: rawPlugins[id] || {},
      });
    }
    console.log(0);
    return plugins;
  }
}
