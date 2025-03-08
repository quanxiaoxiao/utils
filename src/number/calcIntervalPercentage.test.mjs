import assert from 'node:assert';
import test from 'node:test';

import calcIntervalPercentage from './calcIntervalPercentage.mjs';

const calcPercentageByRangeValue = (value, range) => {
  if (value == null) {
    return 0;
  }
  const [min, max] = range;
  const diff = max - min;
  return Math.min(Math.max((value - min) / diff, 0), 1);
};

test('calcIntervalPercentage', () => {
  assert.equal(
    calcIntervalPercentage(0.1, [20, 80]),
    26,
  );
  assert.equal(
    calcIntervalPercentage(0, [20, 80]),
    20,
  );
  assert.equal(
    calcIntervalPercentage(1.1, [20, 80]),
    80,
  );
  for (let i = 0; i < 100; i++) {
    const range = [20, 80];
    const percentage = i / 100;
    const n = calcIntervalPercentage(percentage, range);
    assert.equal(n, range[0] + (range[1] - range[0]) * percentage);
  }
  for (let i = 0; i < 100; i++) {
    const range = [80, 20];
    const percentage = i / 100;
    const n = calcIntervalPercentage(percentage, range);
    assert.equal(n, range[0] + (range[1] - range[0]) * percentage);
  }
  for (let i = 0; i < 100; i++) {
    const range = [20, 80];
    const percentage = i / 100;
    const step = 5;
    const n = calcIntervalPercentage(percentage, range, step);
    assert((n - range[0]) % step === 0);
    assert(n >= range[0]);
    assert(n <= range[1]);
  }
  for (let i = 0; i < 100; i++) {
    const range = [20, 80];
    const step = 5;
    const percentage = Math.min(Math.max((i - range[0]) / (range[1] - range[0]), 0), 1);
    const n = calcIntervalPercentage(percentage, range, step);
    if (i < range[0]) {
      assert.equal(n, range[0]);
    } else if (i > range[1]) {
      assert.equal(n, range[1]);
    } else {
      assert.equal((n - range[0]) % step, 0);
    }
  }

  const range = [20, 80];
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(21, range), range, 5),
    20,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(22, range), range, 5),
    20,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(23, range), range, 5),
    25,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(23, range), range, 6),
    26,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(23, range), range, 7),
    20,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(23.4, range), range, 7),
    20,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(23.5, range), range, 7),
    27,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(24, range), range, 7),
    27,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(27, range), range, 7),
    27,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(28, range), range, 7),
    27,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(29, range), range, 7),
    27,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(30, range), range, 7),
    27,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(31, range), range, 7),
    34,
  );
});

test('calcIntervalPercentage', () => {
  const range = [80, 20];
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(80, range), range, 5),
    80,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(79, range), range, 5),
    80,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(78, range), range, 5),
    80,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(77.51, range), range, 5),
    80,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(77.49, range), range, 5),
    75,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(77.5, range), range, 5),
    75,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(77, range), range, 5),
    75,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(76, range), range, 5),
    75,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(75, range), range, 5),
    75,
  );
  assert.equal(
    calcIntervalPercentage(calcPercentageByRangeValue(74, range), range, 5),
    75,
  );
});
