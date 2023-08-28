import fs from 'fs';

import { httpRequest } from '../lib/client.js';
import { HexColor } from '../lib/console.js';
import { deepEqual } from '../lib/equals.js';
import { parseJson } from '../lib/json-parser.js';

/**
 * Run a test suite.
 *
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
 *
 * @typedef {Object} Options
 * @property {string|undefined} baseUrl - the base url to override the test suite's base url
 *
 * @param testSuite {TestSuite} - the test suite to run
 * @param options {Options} - the options
 */
const runTest = async (testSuite, options = {}) => {
  const baseUrl = options.baseUrl ?? testSuite.baseUrl;
  for (const request of testSuite.requests) {
    const expectedResponse = request.expectedResult;
    const actualResponse = await httpRequest(
      baseUrl + request.url,
      request.method,
      request.headers,
      request.body,
    );
    if (expectedResponse.statusCode !== actualResponse.statusCode) {
      throw new Error(
        `Expected status code ${expectedResponse.statusCode} but got ${actualResponse.statusCode}`,
      );
    }
    if (!deepEqual(expectedResponse.body, parseJson(actualResponse.data))) {
      throw new Error(
        `Expected body ${expectedResponse.body} but got ${actualResponse.data}`,
      );
    }
    console.log(HexColor('#5ea654')('✓'), request.url);
  }
};

fs.readFile(
  '/Users/a1c0/dev/apricity-nap/apricity-api/test-suite/1691766083612-demo.json',
  'utf-8',
  (err, data) => {
    if (err) {
      throw err;
    }
    const testSuite = JSON.parse(data);
    runTest(testSuite, { baseUrl: 'http://127.0.0.1:8081' })
      .then(x => console.log(x))
      .catch(err => {
        console.error(err);
      });
  },
);