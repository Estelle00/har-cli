import { createServer } from "vite";
import getConfig from "../../config/vite.doc.dev";
async function run() {
  const config = await getConfig();
  const server = await createServer(config);
  await server.listen();
}
export default run;
