import { createServer } from "vite";
import config from "../../config/vite.doc.dev";
async function run() {
  const server = await createServer(config);
  await server.listen();
}
export default run;
