import fs from 'fs';
import { Linter } from "eslint";
import { Ignores } from './types';
import path from "path";

interface PostprocessOptions {
    messages: Linter.LintMessage[][],
    filename: string,
    ignores: Ignores
}

const postprocess = ({ messages, filename, ignores }: PostprocessOptions) => {
    // console.log('ADJ postprocess', { messages, messages0: messages?.[0], filename, ignores });

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

    // console.log('ADJ newMessages', newMessages);

    return newMessages;
};

export { postprocess };
