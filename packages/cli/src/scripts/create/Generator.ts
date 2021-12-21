import GeneratorAPI from "./GeneratorAPI";
import { writeFileTree } from "../../utils/writeFileTree";

interface Options {
  plugins: any[];
  pkg: any;
}
export default class Generator {
  plugins: any[];
  pkg: any;
  depSources: Record<string, string> = {};
  fileMiddlewares: any[] = [];
  files: Record<string, string> = {};
  constructor(public readonly context: string, options: Options) {
    this.plugins = options.plugins;
    this.pkg = options.pkg;
  }
  initPlugins(): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      for (const plugin of this.plugins) {
        const { id, apply } = plugin;
        apply.then((res: any) => {
          i++;
          const api = new GeneratorAPI(id, this);
          res.default(api);
          if (i >= plugin.length - 1) {
            resolve();
          }
        });
      }
    });
  }
  async generate() {
    await this.initPlugins();
    // const initialFiles = { ...this.files };
    await this.resolveFiles();

    this.files["package.json"] = JSON.stringify(this.pkg, null, 2);

    writeFileTree(this.context, this.files);
  }
  async resolveFiles() {
    const files = this.files;
    for (const middleware of this.fileMiddlewares) {
      await middleware(files);
    }
  }
}
