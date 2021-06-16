import { Linter } from "eslint";
import { postprocess } from "./postprocess";

const processor = {
  postprocess(messages: Linter.LintMessage[][], filename: string) {
    // @ts-ignore
    if (global.ESLINT_REBASE_REBASING) {
      return messages[0];
    }
    return postprocess({ messages, filename });
  },
};

export { processor };
