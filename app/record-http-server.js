import http from 'http';

import { httpRequest } from '../lib/client.js';
import { globToRegex } from '../lib/glob-to-regex.js';
import { parseJson } from '../lib/json-parser.js';
import { memoize } from '../lib/memoize.js';
import { logRequest, mimetesLog } from './app-logger.js';
import { Writer } from './writer.js';

/**
 * Returns the body of a request
 *
 * @param req {IncomingMessage} - the request
 * @returns {Promise<Buffer>} - the body of the request
 */
export const getBody = req =>
  new Promise((resolve, reject) => {
    let body = [];
    req
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        resolve(Buffer.concat(body));
      })
      .on('error', err => {
        reject(err);
      });
  });

/**
 * Bundles a predicate depending on including and excluding methods
 * @param includeMethods {string[]|undefined} - the methods to include
 * @param excludeMethods {string[]|undefined} - the methods to exclude
 * @returns {function(string): boolean} - the method predicate
 */
// TODO: test regex vs includes array method performance
const bundleMethodPredicate = (includeMethods, excludeMethods) => {
  if (!includeMethods && !excludeMethods) {
    return () => true;
  }
  const excludeRegex = excludeMethods
    ? `(?:(?!${excludeMethods.join('|')}))`
    : '';
  const includeRegex = includeMethods ? `${includeMethods.join('|')}` : '.*';
  const methodRegex = new RegExp(`^${excludeRegex}${includeRegex}$`);

  // memoize the method predicate to avoid testing twice the same value
  return memoize(method => methodRegex.test(method));
};

const allPass = predicates => value => {
  for (const predicate of predicates) {
    if (!predicate(value)) {
      return false;
    }
  }
  return true;
};

const bundleGlobPathPredicate = (includeGlob, excludeGlob) => {
  if (!includeGlob && !excludeGlob) {
    return () => true;
  }

  const excludePredicates = excludeGlob
    .map(globToRegex)
    .map(regex => path => !regex.test(path));

  const includePredicates = includeGlob
    .map(globToRegex)
    .map(regex => path => regex.test(path));

  const predicates = [...excludePredicates, ...includePredicates];

  // memoize the method predicate to avoid testing twice the same value
  return memoize(allPass(predicates));
};

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

  const onRequest = async (req, res) => {
    const url = req.url;
    const method = req.method;
    const headers = req.headers;
    const body = await getBody(req);
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
    }
    res.writeHead(result.statusCode, result.headers);
    res.end(result.data);
    logRequest(method, listeningBaseUrl, url, result.statusCode);
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
      `Mimetes server stopped. Report written to ${report.outputDir}/${writer.filename}.json`,
    );
  };
};
