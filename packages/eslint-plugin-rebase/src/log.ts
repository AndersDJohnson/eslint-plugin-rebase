import chalk from "chalk";

const prefix = chalk.bgMagenta.whiteBright.bold(" eslint-rebase ");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (...args: any[]) => {
  console.info(prefix, ...args);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logError = (...args: any[]) => {
  console.error(prefix, ...args);
};
