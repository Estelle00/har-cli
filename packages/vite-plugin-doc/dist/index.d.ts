import type { Plugin } from "vite";
export interface Options {
    srcDir?: string;
}
export default function createVueDoc(options?: Options): Plugin;
