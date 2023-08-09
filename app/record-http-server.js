import http from 'http';

import { request } from '../lib/client.js';
import { parseJson } from '../lib/json-parser.js';
import { Writer } from '../lib/writer.js';
import { logRequest, mimetesLog } from './app-logger.js';

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
 * Runs the Mimetes server
 * @param listeningBaseUrl {string} - the base url to listen to
 * @param port {number} - the port to listen to
 * @param report {object} - the report
 * @param report.name {string} - the name of the report
 * @param report.outputDir {string} - the directory to write the report to
 * @return {function(): void} - a function to stop the server
 */
export const startMimetesServer = (listeningBaseUrl, port, report) => {
  const writer = new Writer(report.name, report.outputDir);

  /**
   * Handles the request
   * @param req {IncomingMessage} - the request
   * @param res {ServerResponse} - the response
   * @returns {Promise<void>}
   */
  const onRequest = async (req, res) => {
    const url = req.url;
    const method = req.method;
    const headers = req.headers;
    const body = await getBody(req);
    const result = await request(
      `${listeningBaseUrl}${url}`,
      method,
      headers,
      body,
    );
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
