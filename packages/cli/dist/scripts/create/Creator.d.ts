export default class Creator {
    readonly name: string;
    readonly context: string;
    constructor(name: string, context: string);
    create(): Promise<void>;
    resolvePlugins(rawPlugins: Record<string, any>): Promise<{
        apply: any;
        options: any;
    }[]>;
}
