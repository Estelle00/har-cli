import type Generator from "./Generator";
import path from "path";
import deepmerge from "deepmerge";
import tryGetNewerRange from "../../utils/tryGetNewerRange";

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
}
export default GeneratorAPI;
