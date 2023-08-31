import { color, hexColor, logger } from '../lib/console.js';
import { memoize } from '../lib/memoize.js';

// "OPTIONS" Or "CONNECT" are the longest
// (https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
const MAX_METHOD_NAME_LENGTH = 7;

const httpMethod = memoize(value => {
  switch (value) {
    case 'GET': {
      return hexColor('#54a454')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    }

    case 'POST': {
      return hexColor('#516ea2')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    }

    case 'PUT': {
      return hexColor('#b7bb5c')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    }

    case 'PATCH': {
      return hexColor('#9f824d')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    }

    case 'DELETE': {
      return hexColor('#9d5353')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    }

    default: {
      return hexColor('#B0B0B0')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    }
  }
});

/**
 * Logs a request
 * @param method {string} - the method
 * @param host {string} - the host
 * @param endpoint {string} - the endpoint
 * @param statusCode {number} - the status code
 * @returns {void}
 */
export const logRequestRecorded = (method, host, endpoint, statusCode) => {
  const color = statusCode >= 400 ? '#9d5353' : '#54a454';
  logger.log(
    `${httpMethod(method)} ${hexColor('#808080')(host)}${endpoint} ${hexColor(
      color,
    )(`(${statusCode})`)}`,
  );
};

export const logRequestTest = (
  { method, url, expectedResult: { statusCode } },
  success,
) => {
  const colorText = success ? hexColor('#54a454') : x => color.red(x);
  const icon = success ? '✓' : '×';
  logger.log(
    colorText(
      `${icon} ${method.padEnd(MAX_METHOD_NAME_LENGTH)} ${url} (${statusCode})`,
    ),
  );
};

/**
 * Logs a message with the mimetes color
 * @param message {string} - the message to log
 * @returns {void}
 */
export const mimetesLog = message => {
  logger.log(hexColor('#ffebc4')(message));
};
