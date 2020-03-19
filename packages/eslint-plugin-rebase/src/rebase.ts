import { CLIEngine, Linter } from 'eslint';
import { RebaseFileOptions, RebaseOptions } from './types';
import { log } from './log';

const rebaseFile = ({ file, cliEngine } : RebaseFileOptions) => {
    const { code, filename } = file;

    const { results } = cliEngine.executeOnText(code, filename);

    const ignores: Record<string, Record<string, boolean>> = {};

    for (const result of results) {
        const { messages } = result;

        const lines = code.split(/[\r\n]/);

        const fatalMessages = messages.filter(message => message.fatal);

        if (fatalMessages.length) {
            return { errors: fatalMessages };
        }

        for (const message of messages) {
            const { ruleId, line } = message;

            if (!ruleId) {
                break;
            }

            log('...violation on line', line, ':', ruleId);

            ignores[ruleId] = ignores[ruleId] ?? {};

            const key = lines[line - 1].trim();

            ignores[ruleId][key] = true;
        }
    }

    return { ignores };
};

const rebase = ({ files, cliEngine }: RebaseOptions) => {
    const ignores: Record<string, Record<string, boolean>> = {};

    let errors: Linter.LintMessage[] = [];

    // @ts-ignore
    global.ESLINT_REBASE_REBASING = true;

    const actualCLIEngine = cliEngine ?? new CLIEngine({});

    for (const file of files) {
        const { filename } = file;

        log('Rebasing:', filename);

        const { ignores: fileIgnores, errors: fileErrors } = rebaseFile({ file, cliEngine: actualCLIEngine });

        log('...rebased!');

        if (fileErrors?.length) {
            errors = [...errors, ...fileErrors];
            break;
        }

        if (!fileIgnores) {
            break;
        }

        for (const [ruleId, ruleIgnores] of Object.entries(fileIgnores)) {
            ignores[ruleId] = ignores[ruleId] ?? {};

            for (const ruleIgnoreKey of Object.keys(ruleIgnores)) {
                const key = `${file.filename}::${ruleIgnoreKey}`;

                ignores[ruleId][key] = true;
            }
        }
    }

    return { ignores: (Object.keys(ignores).length > 0 ? ignores : undefined), errors: (errors.length ? errors : undefined) };
};

export { rebase, rebaseFile };
