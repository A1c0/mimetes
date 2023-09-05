import { Buffer } from 'node:buffer';
import http from 'node:http';

import { httpRequest } from '../lib/client.js';
import { parseJson } from '../lib/json-parser.js';
import { logRequestRecorded, mimetesLog } from './app-logger.js';
import {
  bundleGlobPathPredicate,
  bundleMethodPredicate,
} from './input-predicate.js';
import { Writer } from './writer.js';

/**
 * Returns the body of a request
 *
 * @param request {IncomingMessage} - the request
 * @returns {Promise<Buffer>} - the body of the request
 */
export const getBody = request =>
  new Promise((resolve, reject) => {
    const body = [];
    request
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        resolve(Buffer.concat(body));
      })
      .on('error', error => {
        reject(error);
      });
  });

/**
 * Runs the Mimetes server
 * @param listeningBaseUrl {string} - the base url to listen to
 * @param port {number} - the port to listen to
 * @param report {object} - the report
 * @param report.name {string} - the name of the report
 * @param report.outputDir {string} - the directory to write the report to
 * @param options {object} - the options
 * @param options.excludeMethods {string[]} - the methods to exclude
 * @param options.excludePaths {string[]} - the paths to exclude
 * @param options.includeMethods {string[]} - the methods to include
 * @param options.includePaths {string[]} - the paths to include
 * @return {function(): void} - a function to stop the server
 */
export const startMimetesServer = (
  listeningBaseUrl,
  port,
  report,
  options = {},
) => {
  const writer = new Writer(report.name, report.outputDir, listeningBaseUrl);

  /**
   * Handles the request
   * @param req {IncomingMessage} - the request
   * @param res {ServerResponse} - the response
   * @returns {Promise<void>}
   */

  const isMethodAllowed = bundleMethodPredicate(
    options.includeMethods,
    options.excludeMethods,
  );

  const isPathAllowed = bundleGlobPathPredicate(
    options.includePaths,
    options.excludePaths,
  );

  const onRequest = async (request, response) => {
    const url = request.url;
    const method = request.method;
    const headers = request.headers;
    const body = await getBody(request);
    const result = await httpRequest(
      `${listeningBaseUrl}${url}`,
      method,
      headers,
      body,
    );
    if (isMethodAllowed(method) && isPathAllowed(url)) {
      writer.writeJson({
        url,
        method,
        headers,
        body: parseJson(body),
        expectedResult: {
          statusCode: result.statusCode,
          headers: result.headers,
          body: parseJson(result.data),
        },
      });
      logRequestRecorded(method, listeningBaseUrl, url, result.statusCode);
    }

    response.writeHead(result.statusCode, result.headers);
    response.end(result.data);
  };

  const server = http.createServer(onRequest);
  server.listen(port, () => {
    mimetesLog(
      `Mimetes server listening on http://localhost:${port}. Press Ctrl+C to stop.`,
    );
  });

  return () => {
    writer.terminate();
    server.close();
    mimetesLog(
      `\nMimetes server stopped. Report written to ${report.outputDir}/${writer.filename}`,
    );
  };
};
