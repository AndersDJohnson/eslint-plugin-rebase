import fs from 'fs';
import yargs from 'yargs';
import glob from 'glob';
import { flatten, uniq } from 'lodash';
import chalk from 'chalk';
import { rebase } from './rebase';
import { log } from './log';

const run = () => {
  const { argv: {
   _: files
  } } = yargs;

  const filesExpanded = uniq(flatten(files.map(file => glob.sync(file))));

  log(`found files:\n  ${filesExpanded.join('\n  ')}`);

  const filesWithCode = filesExpanded.map(file => ({
    filename: file,
    code: fs.readFileSync(file, 'utf8')
  }));

  const ignores = rebase({ files: filesWithCode });

  const rebaseFileContents = {
    ignores
  };

  const rebaseFilePath = '.eslint-rebase.json';

  fs.writeFileSync(rebaseFilePath, JSON.stringify(rebaseFileContents, null, 2 ));

  log(`${chalk.green('wrote ignores to')} "${rebaseFilePath}"`);
};

run();
