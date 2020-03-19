import { CLIEngine } from 'eslint';

export type Ignores = Record<string, Record<string, string[]>>;

export type RebaseManifest = {
    ignores: Ignores;
};

export interface File {
    filename: string;
    code: string;
}

export interface RebaseFileOptions {
    file: File;
    cliEngine: CLIEngine;
}

export interface RebaseOptions {
    files: File[];
    cliEngine?: CLIEngine;
}
