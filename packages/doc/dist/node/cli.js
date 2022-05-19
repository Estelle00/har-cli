"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const index_1 = require("./index");
const chalk_1 = __importDefault(require("chalk"));
const cli = (0, cac_1.cac)("doc");
cli
    .command("dev [root]", "启动开发模式", {
    allowUnknownOptions: true,
})
    .action((root, arg) => {
    delete arg["--"];
    (0, index_1.createServer)(root, arg)
        .then((server) => server.listen())
        .then((server) => {
        server.printUrls();
    })
        .catch((err) => {
        console.error(chalk_1.default.red(`failed to start server. error:\n`), err);
        process.exit(1);
    });
});
cli.help();
cli.version(require("../../package.json").version);
cli.parse();
