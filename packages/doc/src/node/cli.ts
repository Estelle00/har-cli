import { cac } from "cac";
import { createServer } from "./index";
const cli = cac("doc");
cli
  .command("dev [root]", "启动开发模式", {
    allowUnknownOptions: true,
  })
  .action(async (root, arg) => {
    delete arg["--"];
    await createServer(root, arg);
  });
cli.help();
cli.version(require("../../package.json").version);
cli.parse();
