import { execSync } from 'node:child_process';
import fs from 'node:fs';

import { color, logger } from '../../lib/console.js';
import { parseJson } from '../../lib/json-parser.js';
import { logRequestTest } from '../app-logger.js';
import { TestRunnerError, testRequest } from '../test-runner.js';
import { cliCmd, exitLog, prompt } from './common.js';

const pbCoby = data => {
  execSync(`pbcopy`, { input: JSON.stringify(data) });
};

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
  const interactive = args?.options?.interactive;
  const debug = args?.options?.debug;

  (async () => {
    for (const file of files) {
      let isReportModified = false;
      const report = safeReadFile(file);
      if (report.title) {
        logger.log('\n' + report.title + color.gray(` (${file})`));
      } else {
        logger.log('\n' + file);
      }
      if (report.description) {
        logger.log(color.gray(report.description));
      }
      // eslint-disable-next-line no-await-in-loop
      const baseUrl = args?.options.base ?? report.baseUrl;
      for (const request of report.requests) {
        try {
          await testRequest(request, baseUrl, { ignoredProps });
          logRequestTest(request, true);
        } catch (error) {
          if (error instanceof TestRunnerError) {
            logRequestTest(error.request, false);
            logger.error(error.message);
            if (debug) {
              fs.writeFileSync(
                'expected.json',
                JSON.stringify(error.request.expectedResult.body),
              );
              fs.writeFileSync('actual.json', error.actualResponse.data);
              console.log('expected.json and actual.json written to disk.');
            }
            if (interactive) {
              const override = await prompt(
                'Override ?' + color.gray(' (y/n) '),
              ).then(answer => /\s*y\s*/i.test(answer));
              if (!override) {
                exitLog('Test failed.');
              }
              request.expectedResult = {
                statusCode: error.actualResponse.statusCode,
                body: parseJson(error.actualResponse.data),
              };
              isReportModified = true;
            } else {
              exitLog('Test failed.');
            }
          } else {
            exitLog(error.toString());
          }
        }
      }
      if (isReportModified) {
        fs.writeFileSync(file, JSON.stringify(report, null, 2));
      }
    }
  })();

  return true;
});
