import fs from 'fs';
import path from "path";
import { Linter } from "eslint";
import chalk from 'chalk';
import { RebaseManifest } from './types';
import { logError } from './log';

interface PostprocessOptions {
    messages: Linter.LintMessage[][],
    filename: string,
}

const postprocess = ({ messages, filename }: PostprocessOptions) => {
    const rebaseJsonPath = process.cwd() + '/.eslint-rebase.json';

    if (!fs.existsSync(rebaseJsonPath)) {
        logError(`${chalk.red('could not find JSON file')}: ${rebaseJsonPath}`);

        return messages[0];
    }

    const rebaseObject = require(rebaseJsonPath)  as RebaseManifest;

    // TODO: Validate manifest syntax.

    const { ignores = {} } = rebaseObject;

    const newMessages: Linter.LintMessage[] = [];

    for (const message of messages[0]) {
        const text = fs.readFileSync(filename, 'utf8');
        const lines = text.split(/[\r\n]/);
        const line = lines[message.line - 1].trim();

        const relativeFilename = path.relative(process.cwd(), filename);

        const key = `${relativeFilename}::${line}`;

        if (!ignores[key]) {
           newMessages.push(message);
        }
    }

    return newMessages;
};

export { postprocess };
