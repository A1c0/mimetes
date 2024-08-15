import { Buffer } from 'node:buffer';

import { httpRequest } from '../lib/client.js';
import { deepEqual } from '../lib/equals.js';
import { parseJson } from '../lib/json-parser.js';

/**
 * @typedef {Object} TestRunnerError
 * @property {string} message - the error message
 * @property {Object} request - the request
 * @property {Object} actualResponse - the actual response
 */
export class TestRunnerError extends Error {
  constructor(message, request, actualResponse) {
    super(message);
    this.name = 'TestRunnerError';
    this.request = request;
    this.actualResponse = actualResponse;
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
 */

export async function testRequest(request, baseUrl, options) {
  const expectedResponse = request.expectedResult;

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
      actualResponse,
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
      actualResponse,
    );
  }
}
