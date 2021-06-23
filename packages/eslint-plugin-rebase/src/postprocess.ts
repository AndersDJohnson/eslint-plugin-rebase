import fs from "fs";
import path from "path";
import { Linter } from "eslint";
import chalk from "chalk";
import { RebaseManifest } from "./types";
import { logError } from "./log";

interface PostprocessOptions {
  messages: Linter.LintMessage[][];
  filename: string;
}

const postprocess = ({ messages, filename }: PostprocessOptions) => {
  const rebaseJsonPath = process.cwd() + "/.eslint-rebase.json";

  if (!fs.existsSync(rebaseJsonPath)) {
    logError(
      chalk.yellow(
        'Warning: Could not find manifest file at ".eslint-rebase.json". To create one, use the `eslint-rebase` CLI.'
      )
    );

    return messages[0];
  }

  const rebaseObject = require(rebaseJsonPath) as RebaseManifest;

  // TODO: Validate manifest syntax.

  const { ignores = {}, warnings = {} } = rebaseObject;

  const newMessages: Linter.LintMessage[] = [];

  for (const message of messages[0]) {
    const { ruleId } = message;

    if (!ruleId) {
      break;
    }

    const text = fs.readFileSync(filename, "utf8");
    const lines = text.split(/[\r\n]/);
    const line = lines[message.line - 1].trim();

    const relativeFilename = path
      .relative(process.cwd(), filename)
      .replace(/\\/g, "/");

    if (warnings[relativeFilename]?.[ruleId]?.includes(line)) {
      newMessages.push({
        ...message,
        severity: 1,
      });
    } else if (!ignores[relativeFilename]?.[ruleId]?.includes(line)) {
      newMessages.push(message);
    }
  }

  return newMessages;
};

export { postprocess };
