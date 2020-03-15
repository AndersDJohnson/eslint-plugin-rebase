import fs from 'fs';
import {Linter} from "eslint";
import { postprocess } from "./postprocess";

const processors = {
    '.js' : {
        postprocess(messages: Linter.LintMessage[][], filename: string) {
            const rebaseJsonPath = process.cwd() + '/.eslint-rebase.json';

            if (!fs.existsSync(rebaseJsonPath)) {
                console.error(`eslint-plugin-disable could not find JSON file: ${rebaseJsonPath}`);

                return messages;
            }

            const ignores = require(rebaseJsonPath).ignores;

            // const hashes = {
            //     'src/index.js::console.log(\'ok\');': true
            // };

            const newMessages = postprocess({ messages, filename, ignores });

            return newMessages
        }
    }
};

const plugin = {
  processors
};

export default plugin;
