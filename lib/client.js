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
      .request(url, { method, headers }, res => {
        const dataReceived = [];
        res.on('data', chunk => {
          dataReceived.push(chunk);
        });
        res.on('end', () => {
          resolve({
            data: Buffer.concat(dataReceived),
            statusCode: res.statusCode,
            headers: res.headers,
          });
        });
      })
      .on('error', error => {
        reject({ err: error });
      });
    if (dataToSend) {
      request.write(dataToSend);
    }

    request.end();
  });
