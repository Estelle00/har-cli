"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearConsole = exports.error = void 0;
const spinner_1 = require("./spinner");
const chalk_1 = __importDefault(require("chalk"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const node_readline_1 = __importDefault(require("node:readline"));
const format = (label, msg) => {
    return msg
        .split("\n")
        .map((line, i) => {
        return i === 0
            ? `${label} ${line}`
            : line.padStart((0, strip_ansi_1.default)(label).length + line.length + 1);
    })
        .join("\n");
};
const chalkTag = (msg) => {
    if (msg) {
        return chalk_1.default.bgBlackBright.white.dim(` ${msg} `);
    }
    return "";
};
function error(msg, tag = null) {
    (0, spinner_1.stopSpinner)();
    const message = format(chalk_1.default.bgRed(" ERROR ") + chalkTag(tag), chalk_1.default.red(msg));
    console.error(msg, message);
    if (msg instanceof Error) {
        console.error(msg.stack);
    }
}
exports.error = error;
function clearConsole(title) {
    if (process.stdout.isTTY) {
        const blank = "\n".repeat(process.stdout.rows);
        console.log(blank);
        node_readline_1.default.cursorTo(process.stdout, 0, 0);
        node_readline_1.default.clearScreenDown(process.stdout);
        if (title) {
            console.log(title);
        }
    }
}
exports.clearConsole = clearConsole;
