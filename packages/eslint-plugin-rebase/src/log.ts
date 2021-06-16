import chalk from "chalk";

const prefix = chalk.bgMagenta.whiteBright.bold(" eslint-rebase ");

export const log = (...args: any[]) => {
  console.info(prefix, ...args);
};

export const logError = (...args: any[]) => {
  console.error(prefix, ...args);
};
