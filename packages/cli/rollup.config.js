import path from "node:path";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
export default (commandLineArgs) => {
  const isDev = commandLineArgs.watch;
  const isProd = !isDev;
  return {
    treeshake: {
      moduleSideEffects: "no-external",
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
    output: {
      dir: path.resolve(__dirname, "dist"),
      entryFileNames: `[name].js`,
      chunkFileNames: "chunks/dep-[hash].js",
      exports: "named",
      format: "cjs",
      externalLiveBindings: false,
      freeze: false,
      sourcemap: true,
    },
    input: {
      cli: path.resolve(__dirname, "src/cli.ts"),
    },
    external: Object.keys(require("./package.json").dependencies),
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      typescript({
        tsconfig: "./tsconfig.json",
        module: "esnext",
        target: "es2019",
        esModuleInterop: true,
        ...(isProd
          ? {}
          : {
              declaration: true,
              declarationDir: path.resolve(__dirname, "dist/"),
            }),
      }),
      commonjs({
        extensions: [".js"],
      }),
    ],
  };
};
