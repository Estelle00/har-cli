import { ServerOptions } from "vite";
import { resolveConfig } from "./config";

export async function createServer(
  root: string = process.cwd(),
  serverOptions: ServerOptions = {}
) {
  const config = await resolveConfig(root);
}
