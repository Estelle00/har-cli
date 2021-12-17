interface Options {
  plugins: any[];
  pkg: any;
}
export default class Generator {
  plugins: any[];
  pkg: any;
  constructor(public readonly context: string, options: Options) {
    this.plugins = options.plugins;
    this.pkg = options.pkg;
    this.initPlugins();
  }
  initPlugins() {
    for (const plugin of this.plugins) {
      const { id, apply } = plugin;
      apply.then((res: any) => res.default(id));
    }
  }
}
