import { ServerOptions, createServer as createViteServer } from "vite";
import { resolveConfig } from "./config";
import { createDocPlugin } from "./plugin";

export async function createServer(
  root: string = process.cwd(),
  serverOptions: ServerOptions = {}
) {
  const config = await resolveConfig(root);
  return createViteServer({
    root: config.srcDir,
    base: config.site.base,
    plugins: createDocPlugin(root, config),
    server: serverOptions,
  });
}
