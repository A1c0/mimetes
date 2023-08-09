import fs from 'fs';
import path from 'path';
import url from 'url';

import { logger } from '../../lib/console.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const exitLog = (msg, code = 1) => {
  logger.error(msg);
  process.exit(code);
};

/**
 * Show a usage document
 *
 * @param docName {string} The name of the usage document to show
 * @returns {void}
 */
export const showUsage = docName => {
  const docPath = path.resolve(__dirname, `../../assets/usage/${docName}.txt`);
  fs.access(docPath, fs.constants.F_OK, err => {
    if (err) {
      exitLog(`Usage document '${docPath}' not found.`);
    }
  });
  fs.createReadStream(docPath).pipe(process.stdout);
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
  return Number.parseInt(value);
};

const parseString = (propName, value) => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    exitLog(`Invalid ${propName} value '${value}. Must be a string.'`);
  }
  return value;
};
