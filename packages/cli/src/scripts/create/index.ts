import Creator from "./Creator";
import { CWD } from "../../config";
import path from "node:path";
import { stopSpinner } from "../../utils/spinner";
import { clearConsole, error } from "../../utils/logger";
import fs from "fs-extra";
import inquirer from "inquirer";
import chalk from "chalk";
async function create(appName: string) {
  const inCurrent = appName === ".";
  const name = inCurrent ? path.relative("../", CWD) : appName;
  const targetDir = path.resolve(CWD, appName || ".");
  if (fs.existsSync(targetDir)) {
    clearConsole(`HAR CLI`);
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          type: "confirm",
          name: "ok",
          message: "在当前目录中生成项目?",
        },
      ]);
      if (!ok) return;
    } else {
      const { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: `${chalk.cyan(targetDir)}目录已存在。 选择执行规则：`,
          choices: [
            { name: "重写", value: "overwrite" },
            { name: "合并", value: "merge" },
            { name: "取消", value: false },
          ],
        },
      ]);
      if (!action) return;
      if (action === "overwrite") {
        console.log(`\n删除${chalk.cyan(targetDir)}中...`);
        fs.removeSync(targetDir);
      }
    }
  }
  const creator = new Creator(name, targetDir);
  await creator.create();
}
export default (appName: string) => {
  return create(appName).catch((err) => {
    stopSpinner(false);
    error(err);
    process.exit(1);
  });
};
