import { CLIEngine, Linter } from "eslint";
import { RebaseFileOptions, RebaseOptions } from "./types";
import { log } from "./log";

const rebaseFile = ({ file, cliEngine }: RebaseFileOptions) => {
  const { code, filename } = file;

  const { results } = cliEngine.executeOnText(code, filename);

  const ignores: Record<string, Record<string, boolean>> = {};

  for (const result of results) {
    const { messages } = result;

    const lines = code.split(/[\r\n]/);

    const fatalMessages = messages.filter((message) => message.fatal);

    if (fatalMessages.length) {
      return { errors: fatalMessages };
    }

    for (const message of messages) {
      const { ruleId, line } = message;

      if (!ruleId) {
        break;
      }

      log("...violation on line", line, ":", ruleId);

      ignores[ruleId] = ignores[ruleId] ?? {};

      const key = lines[line - 1].trim();

      ignores[ruleId][key] = true;
    }
  }

  return { ignores };
};

const rebase = ({ files, cliEngine }: RebaseOptions) => {
  const ignores: Record<string, Record<string, string[]>> = {};

  let errors: Linter.LintMessage[] = [];

  global.ESLINT_REBASE_REBASING = true;

  const actualCLIEngine = cliEngine ?? new CLIEngine({});

  for (const file of files) {
    const { filename } = file;

    log("Rebasing:", filename);

    const { ignores: fileIgnores, errors: fileErrors } = rebaseFile({
      file,
      cliEngine: actualCLIEngine,
    });

    log("...rebased!");

    if (fileErrors?.length) {
      errors = [...errors, ...fileErrors];
      break;
    }

    if (!fileIgnores) {
      break;
    }

    ignores[filename] = ignores[filename] ?? {};

    for (const [ruleId, ruleIgnores] of Object.entries(fileIgnores)) {
      ignores[filename][ruleId] = ignores[filename][ruleId] ?? [];

      for (const lineHash of Object.keys(ruleIgnores)) {
        ignores[filename][ruleId].push(lineHash);
      }
    }
  }

  return {
    ignores: Object.keys(ignores).length > 0 ? ignores : undefined,
    errors: errors.length ? errors : undefined,
  };
};

export { rebase, rebaseFile };
