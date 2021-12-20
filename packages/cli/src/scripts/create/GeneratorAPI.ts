import type Generator from "./Generator";
import path from "path";
import ejs, { Options } from "ejs";
import { readFileSync } from "fs-extra";
import deepmerge from "deepmerge";
import tryGetNewerRange from "../../utils/tryGetNewerRange";
import { globbySync } from "globby";
const isObject = (val: any) => val && typeof val === "object";
function arrayMerge(a: any[], b: any[]) {
  return Array.from(new Set([...a, ...b]));
}

function depsMerge(
  generatorId: GeneratorAPI["id"],
  sourceDeps: Record<string, string>,
  depsToInject: Record<string, string>,
  sources: Generator["depSources"]
) {
  const result = { ...sourceDeps };
  for (const depName in depsToInject) {
    const sourceRange = sourceDeps[depName];
    const injectingRange = depsToInject[depName];
    if (sourceRange === injectingRange) {
      continue;
    }
    if (!sourceRange) {
      result[depName] = injectingRange;
      sources[depName] = generatorId;
    } else {
      const r = tryGetNewerRange(sourceRange, injectingRange);
      result[depName] = r || injectingRange;
    }
    if (result[depName] === injectingRange) {
      sources[depName] = generatorId;
    }
  }
  return result;
}

// 获取调用者目录地址
function extractCallDir() {
  const obj = {};
  Error.captureStackTrace(obj);
  // @ts-ignore
  const callSite = obj.stack.split("\n")[3];
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
  const anonymousStackRegExp = /at (.*):\d+:\d+$/;
  let matchResult = callSite.match(namedStackRegExp);
  if (!matchResult) {
    matchResult = callSite.match(anonymousStackRegExp);
  }
  const fileName = matchResult[1];
  return path.dirname(fileName);
}

function renderFile(
  name: string,
  data: Record<string, any>,
  ejsOptions: Options
) {
  const template = readFileSync(name, "utf-8");

  return ejs.render(template, data, ejsOptions);
}
class GeneratorAPI {
  constructor(
    public readonly id: string,
    public readonly generator: Generator
  ) {
    console.log(id);
  }
  resolve(...paths: string[]) {
    return path.resolve(this.generator.context, ...paths);
  }
  extendPackage(files: Record<string, any>) {
    const { pkg } = this.generator;
    for (const key in files) {
      const val = files[key];
      const existing = pkg[key];
      if (isObject(val) && ["dependencies", "devDependencies"].includes(key)) {
        pkg[key] = depsMerge(this.id, existing, val, this.generator.depSources);
      } else if (!(key in pkg)) {
        pkg[key] = val;
      } else if (Array.isArray(val) && Array.isArray(existing)) {
        pkg[key] = arrayMerge(existing, val);
      } else if (isObject(val) && isObject(existing)) {
        pkg[key] = deepmerge(existing, val, {
          arrayMerge,
        });
      } else {
        pkg[key] = val;
      }
    }
  }
  private injectMiddleware(middleware: any) {
    this.generator.fileMiddlewares.push(middleware);
  }
  render(source: string, addData = {}, ejsOptions: Options = {}) {
    const baseDir = extractCallDir();
    source = path.resolve(baseDir, source);
    this.injectMiddleware((files) => {
      const _files = globbySync("**/*", {
        cwd: source,
        dot: true,
      });
      for (const rawPath of _files) {
        const targetPath = rawPath
          .split("/")
          .map((filename) => {
            if (filename.charAt(0) === "_") {
              if (filename.charAt(1) !== "_") {
                // 处理下划线转.
                return `.${filename.slice(1)}`;
              } else {
                return filename.slice(1);
              }
            }
            return filename;
          })
          .join("/");
        const sourcePath = path.resolve(source, rawPath);
        const content = renderFile(sourcePath, addData, ejsOptions);
        if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
          files[targetPath] = content;
        }
      }
    });
    // 添加文件处理方法
  }
}
export default GeneratorAPI;
