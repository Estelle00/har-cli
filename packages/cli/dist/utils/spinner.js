"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.failSpinner = exports.resumeSpinner = exports.pauseSpinner = exports.stopSpinner = exports.logWithSpinner = void 0;
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const spinner = (0, ora_1.default)();
let lastMsg = null;
let isPaused = false;
function logWithSpinner(symbol, msg) {
    if (!msg) {
        msg = symbol;
        symbol = chalk_1.default.green("√");
    }
    if (lastMsg) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text,
        });
    }
    spinner.text = " " + msg;
    lastMsg = {
        symbol: symbol + " ",
        text: msg,
    };
    spinner.start();
}
exports.logWithSpinner = logWithSpinner;
function stopSpinner(persist = false) {
    if (!spinner.isSpinning)
        return;
    if (lastMsg && persist) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text,
        });
    }
    else {
        spinner.stop();
    }
    lastMsg = null;
}
exports.stopSpinner = stopSpinner;
function pauseSpinner() {
    if (spinner.isSpinning) {
        spinner.stop();
        isPaused = true;
    }
}
exports.pauseSpinner = pauseSpinner;
function resumeSpinner() {
    if (isPaused) {
        spinner.start();
        isPaused = false;
    }
}
exports.resumeSpinner = resumeSpinner;
function failSpinner(text) {
    spinner.fail(text);
}
exports.failSpinner = failSpinner;
