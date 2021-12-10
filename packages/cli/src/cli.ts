#!/usr/bin/env node

import { cac } from "cac";
import buildComponent from "./scripts/build-component";
const cli = cac("har");
cli.command("build:component").action(async () => {
  await buildComponent();
});
cli.help();
// eslint-disable-next-line @typescript-eslint/no-var-requires
cli.version(require("../package.json").version);
cli.parse();
