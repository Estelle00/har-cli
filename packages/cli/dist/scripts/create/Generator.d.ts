interface Options {
    plugins: any[];
    pkg: any;
}
export default class Generator {
    readonly context: string;
    plugins: any[];
    pkg: any;
    depSources: Record<string, string>;
    fileMiddlewares: any[];
    files: Record<string, string>;
    constructor(context: string, options: Options);
    initPlugins(): void;
    generate(): Promise<void>;
    resolveFiles(): Promise<void>;
}
export {};
