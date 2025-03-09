import assert from 'node:assert';
import test from 'node:test';

import shuffleArray from './shuffleArray.mjs';

test('shuffleArray', () => {
  const defaultArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const arr = [...defaultArray];
  const len = arr.length;
  const statistics = {};
  const count = 1000000;
  const countPer = Math.floor(count / len);
  const offset = 3;
  for (let i = 0; i < count; i++) {
    const ret = shuffleArray(arr);
    assert(ret !== arr);
    assert.equal(ret.length, len);
    for (let j = 0; j < len; j++) {
      const v1 = ret[j];
      const v2 = defaultArray[(offset + j) % len];
      if (v1 === v2) {
        if (statistics[j] == null) {
          statistics[j] = 0;
        }
        statistics[j] += 1;
      }
    }
  }
  assert.deepEqual(arr, defaultArray);
  const keyList = Object.keys(statistics);
  assert.equal(keyList.length, len);
  for (let i = 0; i < keyList.length; i++) {
    const diff = Math.abs(countPer - statistics[keyList[i]]);
    assert(diff < Math.floor(count * 0.01));
  }
});
