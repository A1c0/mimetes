import { HexColor } from '../lib/console.js';
import { memoize } from '../lib/memoize.js';

// "OPTIONS" Or "CONNECT" are the longest
// (https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
const MAX_METHOD_NAME_LENGTH = 7;

const HttpMethod = memoize(value => {
  switch (value) {
    case 'GET':
      return HexColor('#54a454')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    case 'POST':
      return HexColor('#516ea2')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    case 'PUT':
      return HexColor('#b7bb5c')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    case 'PATCH':
      return HexColor('#9f824d')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    case 'DELETE':
      return HexColor('#9d5353')(value.padEnd(MAX_METHOD_NAME_LENGTH));
    default:
      return HexColor('#B0B0B0')(value.padEnd(MAX_METHOD_NAME_LENGTH));
  }
});
export const logRequest = (method, host, endpoint, statusCode) => {
  const color = statusCode >= 400 ? '#9d5353' : '#54a454';
  console.log(
    `${HttpMethod(method)} ${HexColor('#808080')(host)}${endpoint} ${HexColor(
      color,
    )(`(${statusCode})`)}`,
  );
};
export const mimetesLog = message => {
  console.log(HexColor('#ffebc4')(message));
};
