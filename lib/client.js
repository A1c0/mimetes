import { Buffer } from 'node:buffer';
import * as http from 'node:http';
import * as https from 'node:https';

/**
 * Make a request depending on the protocol
 * @param url {string} - the url to send the request to
 * @param method {string} - the HTTP method
 * @param headers {object} - the HTTP headers
 * @param callback {function} - the callback
 * @return {http.ClientRequest|ClientRequest}
 */
const requestDependingOnProtocol = (url, { method, headers }, callback) => {
  if (url.startsWith('https')) {
    return https.request(url, { method, headers }, callback);
  }

  return http.request(url, { method, headers }, callback);
};

/**
 * Sends an HTTP request
 * @param url {string} - the url to send the request to
 * @param method {string} - the HTTP method
 * @param headers {object} - the HTTP headers
 * @param dataToSend {Buffer} - the data to send
 * @return {Promise<{data: Buffer, statusCode: number, headers: object}>} - the response
 */
export const httpRequest = (url, method, headers, dataToSend) =>
  new Promise((resolve, reject) => {
    const request = requestDependingOnProtocol(
      url,
      { method, headers },
      response => {
        const dataReceived = [];
        response.on('data', chunk => {
          dataReceived.push(chunk);
        });
        response.on('end', () => {
          resolve({
            data: Buffer.concat(dataReceived),
            statusCode: response.statusCode,
            headers: response.headers,
          });
        });
      },
    ).on('error', error => {
      reject(new Error('Error on http(s) call', { cause: error }));
    });
    if (dataToSend) {
      request.write(dataToSend);
    }

    request.end();
  });
