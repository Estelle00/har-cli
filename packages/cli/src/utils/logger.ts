import { stopSpinner } from "./spinner";
import chalk from "chalk";
import stripAnsi from "strip-ansi";
import readline from "node:readline";
const format = (label: string, msg: string) => {
  return msg
    .split("\n")
    .map((line, i) => {
      return i === 0
        ? `${label} ${line}`
        : line.padStart(stripAnsi(label).length + line.length + 1);
    })
    .join("\n");
};
const chalkTag = (msg: string | null) => {
  if (msg) {
    return chalk.bgBlackBright.white.dim(` ${msg} `);
  }
  return "";
};
export function error(msg: any, tag = null) {
  stopSpinner();
  const message = format(
    chalk.bgRed(" ERROR ") + chalkTag(tag),
    chalk.red(msg)
  );
  console.error(msg, message);
  if (msg instanceof Error) {
    console.error(msg.stack);
  }
}

export function clearConsole(title: string) {
  if (process.stdout.isTTY) {
    const blank = "\n".repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    if (title) {
      console.log(title);
    }
  }
}
