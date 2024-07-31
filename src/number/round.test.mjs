import test from 'node:test';
import assert from 'node:assert';
import round from './round.mjs';

test('round', () => {
  assert.equal(round(22.333), 22);
  assert.equal(round(22.55), 23);
  assert.equal(round(22.55, 1), 22.6);
  assert.equal(round(22.522, 1), 22.5);
  assert.equal(round(22.522, 2), 22.52);
  assert.equal(round(22.522, 4), 22.522);
  assert.equal(round(NaN), NaN);
  assert.equal(round(1.0334501829461123e-7, 2), 0);
});
