import test from 'node:test';
import assert from 'node:assert';
import parseInteger from './parseInteger.mjs';

test('parseInteger', () => {
  assert.equal(parseInteger(true), null);
  assert.equal(parseInteger([]), null);
  assert.equal(parseInteger({}), null);
  assert.equal(parseInteger(null), null);
  assert.equal(parseInteger(''), null);
  assert.equal(parseInteger(), null);
  assert.equal(parseInteger(1), 1);
  assert.equal(parseInteger(0), 0);
  assert.equal(parseInteger(0.1), null);
  assert.equal(parseInteger(1.1), null);
  assert.equal(parseInteger(.1), null);
  assert.equal(parseInteger(NaN), null);
  assert.equal(parseInteger(Infinity), null);
  assert.equal(parseInteger(-Infinity), null);

  assert.equal(parseInteger('1'), 1);
  assert.equal(parseInteger('-1'), -1);
  assert.equal(parseInteger('1.1'), null);
  assert.equal(parseInteger('.1'), null);
  assert.equal(parseInteger('0'), 0);
  assert.equal(parseInteger('-0'), null);
  assert.equal(parseInteger('1.'), null);
  assert.equal(parseInteger('333'), 333);
  assert.equal(parseInteger('-333'), -333);
});
