import { Linter, CLIEngine } from 'eslint';
import { RebaseFileOptions, RebaseOptions } from './types';

const rebaseFile = ({ file, eslintConfig } : RebaseFileOptions) => {
    const linter = new Linter();

    const { code, filename } = file;

    const messages = linter.verify(code, eslintConfig,
        filename
    );

    const lines = code.split(/[\r\n]/);

    const ignores: Record<string, boolean> = {};

    for (const message of messages){
        const key = lines[message.line - 1].trim();
        ignores[key] = true;
    }

    return ignores;
};

const rebase = ({ files, eslintConfig}: RebaseOptions) => {
    const ignores: Record<string, boolean> = {};

    const cli = new CLIEngine({});

    for (const file of files) {
        const actualEslintConfig = eslintConfig ?? cli.getConfigForFile(file.filename);
        const fileIgnores = rebaseFile({ file, eslintConfig: actualEslintConfig });
        for (const fileIgnoreKey of Object.keys(fileIgnores)) {
            const key = `${file.filename}::${fileIgnoreKey}`;
            ignores[key] = true;
        }
    }

    return ignores;
};

export { rebase, rebaseFile };
