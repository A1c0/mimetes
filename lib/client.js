import http from 'http';

/**
 * Sends an HTTP request
 * @param url {string} - the url to send the request to
 * @param method {string} - the HTTP method
 * @param headers {object} - the HTTP headers
 * @param dataToSend {Buffer} - the data to send
 * @return {Promise<{data: Buffer, statusCode: number, headers: object}>} - the response
 */
export const request = (url, method, headers, dataToSend) =>
  new Promise((resolve, reject) => {
    const req = http
      .request(url, { method, headers }, res => {
        let dataReceived = [];
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
      .on('error', err => {
        reject({ err });
      });
    req.write(dataToSend);
    req.end();
  });
