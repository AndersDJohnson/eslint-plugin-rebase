import { Linter } from "eslint";
import { postprocess } from "./postprocess";

const processors = {
    '.js' : {
        postprocess(messages: Linter.LintMessage[][], filename: string) {
            return postprocess({ messages, filename });
        }
    }
};

const plugin = {
  processors
};

export default plugin;
