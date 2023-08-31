import { Buffer } from 'node:buffer';

import { httpRequest } from '../lib/client.js';
import { deepEqual } from '../lib/equals.js';
import { parseJson } from '../lib/json-parser.js';

export class TestRunnerError extends Error {
  constructor(message, request) {
    super(message);
    this.name = 'TestRunnerError';
    this.request = request;
  }
}

/**
 * @typedef {Object} TestSuite
 * @property {string} baseUrl - the base url used for all requests
 * @property {Object[]} requests - the requests
 * @property {string} requests[].url - the url
 * @property {string} requests[].method - the HTTP method
 * @property {Object} requests[].headers - the HTTP headers
 * @property {Buffer} requests[].body - the body
 * @property {Object} requests[].expectedResult - the expected result
 * @property {number} requests[].expectedResult.statusCode - the expected status code
 * @property {Object} requests[].expectedResult.headers - the expected headers
 */

/**
 * @typedef {Object} Options
 * @property {string|undefined} baseUrl - the base url to override the test suite's base url
 * @property {string[]} ignoredProps - the properties to ignore when comparing the expected result with the actual result
 * @property {function(Object): void} onRequestPassed - the callback to call when a request passes
 */

/**
 * Run a test suite.
 *
 * @param testSuite {TestSuite} - the test suite to run
 * @param options {Options} - the options
 * @return {Promise<void>} - a promise that resolves when the test suite is finished
 */
export const runTestSuite = async (testSuite, options = {}) => {
  const baseUrl = options.baseUrl ?? testSuite.baseUrl;
  for (const request of testSuite.requests) {
    const expectedResponse = request.expectedResult;
    // eslint-disable-next-line no-await-in-loop
    const actualResponse = await httpRequest(
      baseUrl + request.url,
      request.method,
      request.headers,
      request.body && Buffer.from(JSON.stringify(request.body)),
    );

    if (expectedResponse.statusCode !== actualResponse.statusCode) {
      throw new TestRunnerError(
        `Expected status code ${expectedResponse.statusCode} but got ${actualResponse.statusCode}`,
        request,
      );
    }

    const diffBody = deepEqual(
      parseJson(actualResponse.data),
      expectedResponse.body,
      options.ignoredProps,
    );

    if (diffBody) {
      throw new TestRunnerError(
        `The response body is not as expected:\n${diffBody}\n`,
        request,
      );
    }

    options.onRequestPassed(request);
  }
};
