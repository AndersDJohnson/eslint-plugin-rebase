import { Linter } from 'eslint';

export type Ignores = Record<string, boolean>;

export interface File {
    filename: string;
    code: string;
}

export interface RebaseFileOptions {
    file: File;
    eslintConfig: Linter.Config;
}

export interface RebaseOptions {
    files: File[];
    eslintConfig?: Linter.Config;
}
