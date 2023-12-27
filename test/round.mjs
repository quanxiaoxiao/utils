import test from 'ava'; // eslint-disable-line
import { round } from '../src/index.mjs';

test('1', (t) => {
  t.is(round(22.333), 22);
  t.is(round(22.55), 23);
  t.is(round(22.55, 1), 22.6);
  t.is(round(22.522, 1), 22.5);
  t.is(round(22.522, 2), 22.52);
  t.is(round(22.522, 4), 22.522);
  t.is(round(NaN), NaN);
});
