import { Buffer } from 'node:buffer';
import * as http from 'node:http';

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
    const request = http
      .request(url, { method, headers }, response => {
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
      })
      .on('error', error => {
        reject(new Error('Error on http call', { cause: error }));
      });
    if (dataToSend) {
      request.write(dataToSend);
    }

    request.end();
  });
