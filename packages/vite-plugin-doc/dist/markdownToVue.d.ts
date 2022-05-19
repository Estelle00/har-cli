export declare function transformMain(tokens: any[], file: string, frontMatter: Record<string, any>): {
    vueSrc: string;
    includes: string[];
};
export interface MarkdownCompileResult {
    vueSrc: string;
    includes: string[];
}
export declare function transformDemo(tokens: any[], filename: string, frontMatter?: Record<string, any>): {
    vueSrc: string;
    includes: never[];
};
export declare function createMarkdownToVueRender(srcDir: string): (src: string, file: string) => {
    vueSrc: string;
    includes: string[];
};
