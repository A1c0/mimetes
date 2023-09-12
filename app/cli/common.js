import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import * as readline from 'node:readline';
import url from 'node:url';

import { groupOptions, parsedArgs } from '../../lib/argv-parsing.js';
import { logger } from '../../lib/console.js';
import { memoize } from '../../lib/memoize.js';
import { regexMultiExec } from '../../lib/regex.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/* eslint-disable unicorn/no-process-exit */
export const exitLog = (message, code = 1) => {
  logger.error(message);
  process.exit(code);
};
/* eslint-enable */

/**
 * Read a usage document
 *
 * @param docName {string} The name of the usage document to show
 * @returns {string} The content of the usage document
 * */
export const readUsage = docName => {
  const docPath = path.resolve(
    __dirname,
    `../../app/cli/usages/${docName}.txt`,
  );
  fs.access(docPath, fs.constants.F_OK, error => {
    if (error) {
      exitLog(`Usage document '${docPath}' not found.`);
    }
  });
  return fs.readFileSync(docPath, 'utf8');
};

/**
 * Parse a number from a string if it defined
 * @param propName {string|undefined} The name of the property to parse
 * @param value {string} The string to parse
 */
export const parseInt = (propName, value) => {
  if (!value) {
    return;
  }

  const isInt = /^\d+$/.test(value);
  if (!isInt) {
    exitLog(`Invalid ${propName} value '${value}. Must be an integer.'`);
  }

  return Number.parseInt(value, 10);
};

export const parseString = (propName, value) => {
  if (!value) {
    return undefined;
  }

  if (typeof value !== 'string') {
    exitLog(`Invalid ${propName} value '${value}. Must be a string.'`);
  }

  return value;
};

const parsedArgsMemo = memoize(parsedArgs);

/**
 * Create a CLI command
 * @param usage {string} The name of the usage document to show
 * @param callback {function} The callback to execute
 * @return {(function(*): void)|*}
 */
export const cliCmd = (usage, callback) => {
  const doc = readUsage(usage);
  const optionTxt = doc.replace(/(.*\n)*options:$/im, '');
  const optionRules = regexMultiExec(
    /-(?<short>[a-z]+),\s+--(?<long>[a-zA-Z\d-]+)/g,
    optionTxt,
  ).map(x => x.groups);

  return argv => {
    const args = parsedArgsMemo(argv);
    const scoopedArgs = groupOptions(optionRules, args);

    // If any command is found, show the usage
    if (!callback(scoopedArgs, argv)) {
      logger.log(doc);
    }
  };
};
/**
 * Ask a question to the user and return the answer
 * @param question {string} The question to ask
 * @return {Promise<string>}  The answer
 */
export const prompt = question =>
  new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
