import chalk from 'chalk';

export const log = (...args: any[]) => {
    console.info(chalk.bgBlue.whiteBright.bold(' eslint-rebase '), ...args);
};
