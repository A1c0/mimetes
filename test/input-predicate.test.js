import test from 'ava';

import {
  bundleGlobPathPredicate,
  bundleMethodPredicate,
} from '../app/input-predicate.js';

test('invalidate methods not allowed', t => {
  const isMethodAllowed = bundleMethodPredicate(undefined, ['POST', 'OPTIONS']);
  t.is(isMethodAllowed('POST'), false);
  t.is(isMethodAllowed('OPTIONS'), false);
  t.is(isMethodAllowed('GET'), true);
  t.is(isMethodAllowed('PUT'), true);
});

test('validate only methods allowed', t => {
  const isMethodAllowed = bundleMethodPredicate(['POST', 'OPTIONS'], undefined);
  t.is(isMethodAllowed('POST'), true);
  t.is(isMethodAllowed('OPTIONS'), true);
  t.is(isMethodAllowed('GET'), false);
  t.is(isMethodAllowed('PUT'), false);
});

test('validate only methods allowed and not excluded', t => {
  const isMethodAllowed = bundleMethodPredicate(['POST', 'OPTIONS'], ['GET']);
  t.is(isMethodAllowed('POST'), true);
  t.is(isMethodAllowed('OPTIONS'), true);
  t.is(isMethodAllowed('GET'), false);
  t.is(isMethodAllowed('PUT'), false);
});

test('invalidate paths not allowed', t => {
  const isPathAllowed = bundleGlobPathPredicate(undefined, [
    '/**/health',
    '/client/**/cars/*',
  ]);
  t.is(isPathAllowed('/health'), false);
  t.is(isPathAllowed('/client'), true);
  t.is(isPathAllowed('/client/cars'), true);
  t.is(isPathAllowed('/client/cars/2'), false);
  t.is(isPathAllowed('/client/bus/2'), true);
});
test('validate only paths allowed', t => {
  const isPathAllowed = bundleGlobPathPredicate(
    ['/client/**/cars/**', '/client/**/bus/*'],
    undefined,
  );
  t.is(isPathAllowed('/'), false);
  t.is(isPathAllowed('/any/things'), false);
  t.is(isPathAllowed('/client'), false);
  t.is(isPathAllowed('/client/cars'), false);
  t.is(isPathAllowed('/client/cars/'), true);
  t.is(isPathAllowed('/client/cars/2'), true);
  t.is(isPathAllowed('/client/bus/2'), true);
});

test('validate only paths allowed and not excluded', t => {
  const isPathAllowed = bundleGlobPathPredicate(
    ['/client/**/cars/**', '/client/**/bus/*'],
    ['/client/**/cars/2'],
  );
  t.is(isPathAllowed('/'), false);
  t.is(isPathAllowed('/any/things'), false);
  t.is(isPathAllowed('/client'), false);
  t.is(isPathAllowed('/client/cars'), false);
  t.is(isPathAllowed('/client/cars/'), true);
  t.is(isPathAllowed('/client/cars/1'), true);
  t.is(isPathAllowed('/client/cars/2'), false);
  t.is(isPathAllowed('/client/bus/2'), true);
});
