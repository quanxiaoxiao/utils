import assert from 'node:assert';
import test from 'node:test';

import clamp from './clamp.mjs';

test('clamp', () => {
  assert.equal(clamp(10, [20, 30]), 20);
  assert.equal(clamp(40, [20, 30]), 30);
  assert.equal(clamp(10, [30, 20]), 20);
  assert.equal(clamp(40, [30, 20]), 30);

  for (let i = 0; i < 100; i++) {
    const max = 60;
    const min = 20;
    if (i < min) {
      assert.equal(clamp(i, [min, max]), min);
    } else if (i > max) {
      assert.equal(clamp(i, [min, max]), max);
    } else {
      assert.equal(clamp(i, [min, max]), i);
    }
  }

  for (let i = 0; i < 100; i++) {
    const max = 20;
    const min = 60;
    if (i > min) {
      assert.equal(clamp(i, [max, min]), min);
    } else if (i < max) {
      assert.equal(clamp(i, [max, min]), max);
    } else {
      assert.equal(clamp(i, [max, min]), i);
    }
  }
});
