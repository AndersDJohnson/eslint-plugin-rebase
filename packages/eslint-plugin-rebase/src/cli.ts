#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs';
import glob from 'glob';
import { flatten, uniq } from 'lodash';
import chalk from 'chalk';
import { rebase } from './rebase';
import { log, logError } from './log';

interface Argv {
  _?: string[];
  dry?: boolean;
  force?: boolean;
}

const run = () => {
  const { argv } = yargs.option('dry', {
    alias: 'd',
    type: 'boolean',
    description: 'Dry run (don\'t write ".eslint-rebase.json").'
  }).option('force', {
    alias: 'f',
    type: 'boolean',
    description: 'Force overwrite ".eslint-rebase.json".'
  });

  const { _: files , dry, force } = argv as Argv;

  if (!files?.length) {
    logError(chalk.red('must provide files argument'));
    process.exit(1);
  }

  if (dry) {
    log('In dry mode.')
  }

  const rebaseFilePath = '.eslint-rebase.json';

  log(`Using file "${rebaseFilePath}".`);

  if (!force && fs.existsSync(rebaseFilePath)) {
    logError(`${chalk.red('Won\'t overwrite')} without \`--force\` option.`);

    process.exit(1);
  }

  const filesExpanded = uniq(flatten(files.map((file: string) => glob.sync(file, {
    nodir: true
  }))));

  if (!filesExpanded.length) {
    logError(chalk.red('No files found'));
    return;
  }

  log(`found files:\n  ${filesExpanded.join('\n  ')}\n`);

  const filesWithCode = filesExpanded.map((file: string) => ({
    filename: file,
    code: fs.readFileSync(file, 'utf8')
  }));

  const { ignores, errors } = rebase({ files: filesWithCode });

  if (errors?.length) {
    logError(`${chalk.red('Errors:')}\n  ${errors.map(error => error.message).join('\n  ')}`);

    return;
  }

  const rebaseFileJson = {
    ignores
  };

  const rebaseFileContents = `${JSON.stringify(rebaseFileJson, null, 2 )}\n`;

  if (!force && fs.existsSync(rebaseFilePath)) {
    logError(`${chalk.red('Won\'t overwrite')} without \`--force\` option.`);

    process.exit(1);
  }

  if (dry) {
    log(`${chalk.green('In dry mode, but would\'ve written')}:\n${rebaseFileContents}`);

    return;
  }

  fs.writeFileSync(rebaseFilePath, rebaseFileContents);

  log(`${chalk.green('Wrote ignores to')} "${rebaseFilePath}".`);
};

run();
