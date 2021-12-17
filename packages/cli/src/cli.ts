#!/usr/bin/env node

import { cac } from "cac";
import buildComponent from "./scripts/build-component";
import initProject from "./scripts/init";
const cli = cac("har");
cli.command("build:component").action(async () => {
  // await buildComponent();
});
cli.command("init").action(() => {
  initProject();
});
cli.help();
// eslint-disable-next-line @typescript-eslint/no-var-requires
cli.version(require("../package.json").version);
cli.parse();
