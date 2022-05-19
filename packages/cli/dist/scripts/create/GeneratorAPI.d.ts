import type Generator from "./Generator";
import { Options } from "ejs";
declare class GeneratorAPI {
    readonly id: string;
    readonly generator: Generator;
    constructor(id: string, generator: Generator);
    resolve(...paths: string[]): string;
    extendPackage(files: Record<string, any>): void;
    private injectMiddleware;
    render(source: string, addData?: {}, ejsOptions?: Options): void;
}
export default GeneratorAPI;
