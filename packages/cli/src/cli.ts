import { cac } from "cac";
import buildComponent from "./scripts/build-component";
import create from "./scripts/create";
import docDevRun from "./scripts/doc/dev";
const cli = cac("har");
cli.command("build:component").action(async () => {
  await buildComponent();
});
cli.command("dev:doc").action(async () => {
  await docDevRun();
});
cli.command("create <app-name>").action(async (appName) => {
  await create(appName);
});
cli.help();
// eslint-disable-next-line @typescript-eslint/no-var-requires
cli.version(require("../package.json").version);
cli.parse();
