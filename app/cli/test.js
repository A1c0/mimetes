import fs from 'node:fs';

import { logger } from '../../lib/console.js';
import { logRequestTest } from '../app-logger.js';
import { TestRunnerError, runTestSuite } from '../test-runner.js';
import { cliCmd, exitLog } from './common.js';

/**
 * Validates the format of a report
 *
 * @param object {any} - the object to validate
 * @throws {Error} - if the object is not valid
 */
// eslint-disable-next-line no-unused-vars
const validateFormat = object => {
  // TODO: validate format
};

/**
 * Reads a file and validates it
 * @param file {string} - the file to read
 * @return {any} - the content of the file
 */
const safeReadFile = file => {
  if (!fs.existsSync(file)) {
    exitLog(`File '${file}' does not exist.`);
  }

  if (!fs.statSync(file).isFile()) {
    exitLog(`'${file}' is not a file.`);
  }

  try {
    fs.accessSync(file, fs.constants.R_OK);
  } catch {
    exitLog(`Cannot read file '${file}'.`);
  }

  const content = fs.readFileSync(file, 'utf8');
  // Check if file is json
  try {
    const object = JSON.parse(content);
    try {
      validateFormat(object);
      return object;
    } catch {
      exitLog(`File '${file}' is not a valid Mimetes report.`);
    }
  } catch {
    exitLog(`File '${file}' is not a JSON file.`);
  }
};

export const test = cliCmd('test', args => {
  if (args?.options?.help) {
    return false;
  }

  const files = args?.params;
  if (!files || files.length === 0) {
    exitLog('No files specified. Use --help for more information.');
  }

  const ignoredProps = args?.options?.['ignore-props']?.split(',');
  (async () => {
    for (const file of files) {
      const report = safeReadFile(file);
      logger.log('\n' + file);
      try {
        // eslint-disable-next-line no-await-in-loop
        await runTestSuite(report, {
          onRequestPassed(request) {
            logRequestTest(request, true);
          },
          ignoredProps,
        });
      } catch (error) {
        if (error instanceof TestRunnerError) {
          logRequestTest(error.request, false);
          logger.log(error.message);
        } else {
          throw error;
        }
      }
    }
  })();

  return true;
});
