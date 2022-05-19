"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const build_component_1 = __importDefault(require("./scripts/build-component"));
const create_1 = __importDefault(require("./scripts/create"));
const dev_1 = __importDefault(require("./scripts/doc/dev"));
const cli = (0, cac_1.cac)("har");
cli.command("build:component").action(async () => {
    await (0, build_component_1.default)();
});
cli.command("dev:doc").action(async () => {
    await (0, dev_1.default)();
});
cli.command("create <app-name>").action(async (appName) => {
    await (0, create_1.default)(appName);
});
cli.help();
cli.version(require("../package.json").version);
cli.parse();
