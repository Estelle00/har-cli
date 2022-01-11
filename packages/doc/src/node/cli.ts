import { cac } from "cac";
import { createServer } from "./index";
import chalk from "chalk";
const cli = cac("doc");
cli
  .command("dev [root]", "启动开发模式", {
    allowUnknownOptions: true,
  })
  .action((root, arg) => {
    delete arg["--"];
    createServer(root, arg)
      .then((server) => server.listen())
      .then((server) => {
        server.printUrls();
      })
      .catch((err) => {
        console.error(chalk.red(`failed to start server. error:\n`), err);
        process.exit(1);
      });
  });
cli.help();
cli.version(require("../../package.json").version);
cli.parse();
