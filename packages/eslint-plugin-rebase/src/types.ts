import { CLIEngine } from "eslint";

export type Entries = Record<string, Record<string, string[]>>;

export type RebaseManifest = {
  ignores?: Entries;
  warnings?: Entries;
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
