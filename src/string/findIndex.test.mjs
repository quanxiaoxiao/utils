import assert from 'node:assert';
import test from 'node:test';
import findIndex from './findIndex.mjs';

test('findIndex', () => {
  assert.equal(findIndex('', 'a'), -1);
  assert.equal(findIndex('b', 'a'), -1);
  assert.equal(findIndex('bb', 'bbb'), -1);
  assert.equal(findIndex('ab', 'ab'), 0);
  assert.equal(findIndex('bcaadd', 'a'), 2);
  assert.equal(findIndex('bcaada5d', 'ac'), -1);
  assert.equal(findIndex('bcaadacd', 'ac'), 5);
  assert.equal(findIndex('bcaada5d', '5'), 6);
  assert.equal(findIndex('bcaada5d', '5', 0, 4), -1);
  assert.equal(findIndex('bcaada5d', '5'), 6);
  assert.equal(findIndex('bcaada5d', '5', 4), 6);
  assert.equal(findIndex('bcaad{{asd', '{{'), 5);
  assert.equal(findIndex('bcaad\\{{asd', '{{'), -1);
  assert.equal(findIndex('bcaad\\{{{asd', '{{'), 7);
  assert.equal(findIndex('bcaad{\\{{asd', '{{'), -1);
  assert.equal(findIndex('bcaad\\{{asd', '{{', 6), 6);
  assert.equal(findIndex('bcaad\\{{asd', '{{', 5), -1);
  assert.equal(findIndex('bcaad\\{{', '{{'), -1);
  assert.equal(findIndex('bcaad{{', '{{'), 5);
  assert.equal(findIndex('bcaad\\{{', '{{'), -1);
  assert.equal(findIndex('bcaad\\{{{', '{{'), 7);
  assert.equal(findIndex('bcaad{{aa', '{{', 5), 5);
  assert.equal(findIndex('bcaad{{aa', '{{', 6), -1);
});
