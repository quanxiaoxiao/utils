import assert from 'node:assert';
import test, { mock } from 'node:test';

import waitFor from './waitFor.mjs';
import waitTick from './waitTick.mjs';

test('waitTick 1', async () => {
  const cb = mock.fn();
  const ret = waitTick(100, cb);

  assert.equal(cb.mock.calls.length, 0);

  await waitFor(80);

  assert.equal(cb.mock.calls.length, 0);
  await waitFor(40);
  assert.equal(cb.mock.calls.length, 1);
  ret();
  await waitFor(40);
  assert.equal(cb.mock.calls.length, 1);
});

test('waitTick 2', async () => {
  const cb = mock.fn();
  const ret = waitTick(0, cb);

  assert.equal(cb.mock.calls.length, 0);

  await waitFor(10);
  assert.equal(cb.mock.calls.length, 1);
  ret();
  await waitFor(40);
  assert.equal(cb.mock.calls.length, 1);
});

test('waitTick 3', async () => {
  const cb = mock.fn();
  const ret = waitTick(30, cb);

  await waitFor(10);
  assert.equal(cb.mock.calls.length, 0);
  ret();
  await waitFor(60);
  assert.equal(cb.mock.calls.length, 0);
  ret();
  await waitFor(60);
  assert.equal(cb.mock.calls.length, 0);
});

test('waitTick 5', async () => {
  const cb = mock.fn();
  const ret = waitTick(null, cb);

  await waitFor(60);
  assert.equal(cb.mock.calls.length, 0);
  ret();
  await waitFor(60);
  assert.equal(cb.mock.calls.length, 0);
});
