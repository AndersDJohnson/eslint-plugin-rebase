import { CLIEngine, Linter } from 'eslint';
import { RebaseFileOptions, RebaseOptions } from './types';

const rebaseFile = ({ file, cliEngine } : RebaseFileOptions) => {
    const { code, filename } = file;

    const { results } = cliEngine.executeOnText(code, filename);

    const ignores: Record<string, boolean> = {};

    for (const result of results) {
        const { messages } = result;

        const lines = code.split(/[\r\n]/);

        const fatalMessages = messages.filter(message => message.fatal);

        if (fatalMessages.length) {
            return { errors: fatalMessages };
        }

        for (const message of messages){
            const key = lines[message.line - 1].trim();
            ignores[key] = true;
        }
    }

    return { ignores };
};

const rebase = ({ files, cliEngine }: RebaseOptions) => {
    const ignores: Record<string, boolean> = {};

    let errors: Linter.LintMessage[] = [];

    // @ts-ignore
    global.ESLINT_REBASE_REBASING = true;

    const actualCLIEngine = cliEngine ?? new CLIEngine({});

    for (const file of files) {
        const { ignores: fileIgnores, errors: fileErrors } = rebaseFile({ file, cliEngine: actualCLIEngine });

        if (fileErrors?.length) {
            errors = [...errors, ...fileErrors];
            break;
        }

        if (!fileIgnores) {
            break;
        }

        for (const fileIgnoreKey of Object.keys(fileIgnores)) {
            const key = `${file.filename}::${fileIgnoreKey}`;
            ignores[key] = true;
        }
    }

    return { ignores: (Object.keys(ignores).length > 0 ? ignores : undefined), errors: (errors.length ? errors : undefined) };
};

export { rebase, rebaseFile };
