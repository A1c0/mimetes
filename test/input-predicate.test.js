import test from 'oletus';

import {
  bundleGlobPathPredicate,
  bundleMethodPredicate,
} from '../app/input-predicate.js';

test('invalidate methods not allowed', t => {
  const isMethodAllowed = bundleMethodPredicate(undefined, ['POST', 'OPTIONS']);
  t.deepEqual(isMethodAllowed('POST'), false);
  t.deepEqual(isMethodAllowed('OPTIONS'), false);
  t.deepEqual(isMethodAllowed('GET'), true);
  t.deepEqual(isMethodAllowed('PUT'), true);
});

test('validate only methods allowed', t => {
  const isMethodAllowed = bundleMethodPredicate(['POST', 'OPTIONS'], undefined);
  t.deepEqual(isMethodAllowed('POST'), true);
  t.deepEqual(isMethodAllowed('OPTIONS'), true);
  t.deepEqual(isMethodAllowed('GET'), false);
  t.deepEqual(isMethodAllowed('PUT'), false);
});

test('validate only methods allowed and not excluded', t => {
  const isMethodAllowed = bundleMethodPredicate(['POST', 'OPTIONS'], ['GET']);
  t.deepEqual(isMethodAllowed('POST'), true);
  t.deepEqual(isMethodAllowed('OPTIONS'), true);
  t.deepEqual(isMethodAllowed('GET'), false);
  t.deepEqual(isMethodAllowed('PUT'), false);
});

test('invalidate paths not allowed', t => {
  const isPathAllowed = bundleGlobPathPredicate(undefined, [
    '/**/health',
    '/client/**/cars/*',
  ]);
  t.deepEqual(isPathAllowed('/health'), false);
  t.deepEqual(isPathAllowed('/client'), true);
  t.deepEqual(isPathAllowed('/client/cars'), true);
  t.deepEqual(isPathAllowed('/client/cars/2'), false);
  t.deepEqual(isPathAllowed('/client/bus/2'), true);
});
test('validate only paths allowed', t => {
  const isPathAllowed = bundleGlobPathPredicate(
    ['/client/**/cars/**', '/client/**/bus/*'],
    undefined,
  );
  t.deepEqual(isPathAllowed('/'), false);
  t.deepEqual(isPathAllowed('/any/things'), false);
  t.deepEqual(isPathAllowed('/client'), false);
  t.deepEqual(isPathAllowed('/client/cars'), false);
  t.deepEqual(isPathAllowed('/client/cars/'), true);
  t.deepEqual(isPathAllowed('/client/cars/2'), true);
  t.deepEqual(isPathAllowed('/client/bus/2'), true);
});

test('validate only paths allowed and not excluded', t => {
  const isPathAllowed = bundleGlobPathPredicate(
    ['/client/**/cars/**', '/client/**/bus/*'],
    ['/client/**/cars/2'],
  );
  t.deepEqual(isPathAllowed('/'), false);
  t.deepEqual(isPathAllowed('/any/things'), false);
  t.deepEqual(isPathAllowed('/client'), false);
  t.deepEqual(isPathAllowed('/client/cars'), false);
  t.deepEqual(isPathAllowed('/client/cars/'), true);
  t.deepEqual(isPathAllowed('/client/cars/1'), true);
  t.deepEqual(isPathAllowed('/client/cars/2'), false);
  t.deepEqual(isPathAllowed('/client/bus/2'), true);
});
