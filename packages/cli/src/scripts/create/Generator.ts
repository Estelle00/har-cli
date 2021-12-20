import GeneratorAPI from "./GeneratorAPI";

interface Options {
  plugins: any[];
  pkg: any;
}
export default class Generator {
  plugins: any[];
  pkg: any;
  depSources: Record<string, string> = {};
  fileMiddlewares: any[] = [];
  constructor(public readonly context: string, options: Options) {
    this.plugins = options.plugins;
    this.pkg = options.pkg;
    this.initPlugins();
  }
  initPlugins() {
    for (const plugin of this.plugins) {
      const { id, apply } = plugin;
      apply.then((res: any) => {
        const api = new GeneratorAPI(id, this);
        res.default(api);
      });
    }
  }
}
