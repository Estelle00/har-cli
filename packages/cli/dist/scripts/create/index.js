"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Creator_1 = __importDefault(require("./Creator"));
const config_1 = require("../../config");
const node_path_1 = __importDefault(require("node:path"));
const spinner_1 = require("../../utils/spinner");
const logger_1 = require("../../utils/logger");
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
async function create(appName) {
    const inCurrent = appName === ".";
    const name = inCurrent ? node_path_1.default.relative("../", config_1.CWD) : appName;
    const targetDir = node_path_1.default.resolve(config_1.CWD, appName || ".");
    if (fs_extra_1.default.existsSync(targetDir)) {
        (0, logger_1.clearConsole)(`HAR CLI`);
        if (inCurrent) {
            const { ok } = await inquirer_1.default.prompt([
                {
                    type: "confirm",
                    name: "ok",
                    message: "在当前目录中生成项目?",
                },
            ]);
            if (!ok)
                return;
        }
        else {
            const { action } = await inquirer_1.default.prompt([
                {
                    name: "action",
                    type: "list",
                    message: `${chalk_1.default.cyan(targetDir)}目录已存在。 选择执行规则：`,
                    choices: [
                        { name: "重写", value: "overwrite" },
                        { name: "合并", value: "merge" },
                        { name: "取消", value: false },
                    ],
                },
            ]);
            if (!action)
                return;
            if (action === "overwrite") {
                console.log(`\n删除${chalk_1.default.cyan(targetDir)}中...`);
                fs_extra_1.default.removeSync(targetDir);
            }
        }
    }
    const creator = new Creator_1.default(name, targetDir);
    await creator.create();
}
exports.default = (appName) => {
    return create(appName).catch((err) => {
        (0, spinner_1.stopSpinner)(false);
        (0, logger_1.error)(err);
        process.exit(1);
    });
};
