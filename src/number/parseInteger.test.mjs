import assert from 'node:assert';
import test from 'node:test';

import parseInteger from './parseInteger.mjs';

test('parseInteger', () => {
  assert.equal(parseInteger(true), null);
  assert.equal(parseInteger([]), null);
  assert.equal(parseInteger([33]), null);
  assert.equal(parseInteger({}), null);
  assert.equal(parseInteger(null), null);
  assert.equal(parseInteger(''), null);
  assert.equal(parseInteger(), null);
  assert.equal(parseInteger(1), 1);
  assert.equal(parseInteger(-66), -66);
  assert.equal(parseInteger(0), 0);
  assert.equal(parseInteger(0.1), null);
  assert.equal(parseInteger(1.1), null);
  assert.equal(parseInteger(.1), null);
  assert.equal(parseInteger(NaN), null);
  assert.equal(parseInteger(Infinity), null);
  assert.equal(parseInteger(-Infinity), null);
  assert.equal(parseInteger(Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
  assert.equal(parseInteger(Number.MIN_SAFE_INTEGER), Number.MIN_SAFE_INTEGER);

  assert.equal(parseInteger('1'), 1);
  assert.equal(parseInteger('-1'), -1);
  assert.equal(parseInteger('1.1'), null);
  assert.equal(parseInteger('.1'), null);
  assert.equal(parseInteger('0'), 0);
  assert.equal(parseInteger('-0'), null);
  assert.equal(parseInteger('1.'), null);
  assert.equal(parseInteger('333'), 333);
  assert.equal(parseInteger('042'), null);
  assert.equal(parseInteger('-333'), -333);
  assert.equal(parseInteger(' 42'), null);
  assert.equal(parseInteger('42 '), null);
  assert.equal(parseInteger(' 42 '), null);
});
