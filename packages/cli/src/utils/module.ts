import { createRequire } from "node:module";
import path from "node:path";
export function resolveModule(request: string, context: string) {
  try {
    return createRequire(path.resolve(context, "package.json")).resolve(
      request
    );
  } catch (e) {
    return require.resolve(request, {
      paths: [context],
    });
  }
}
export function loadModule(request: string, context: string) {
  try {
    return createRequire(path.resolve(context, "package.json"))(request);
  } catch (e) {
    const resolvePath = resolveModule(request, context);
    if (resolvePath) {
      return require(resolvePath);
    }
  }
}
