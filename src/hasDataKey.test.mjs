import assert from 'node:assert';
import test from 'node:test';

import hasDataKey from './hasDataKey.mjs';

test('hasDataKey', () => {
  assert(!hasDataKey({}, ''));
  assert(!hasDataKey({ name: null }, 'age'));
  assert(hasDataKey({ name: null }, 'name'));
  assert(!hasDataKey({ obj: { name: null } }, 'name'));
  assert(hasDataKey({ obj: { name: null } }, 'obj.name'));
  assert(hasDataKey([], 'length'));
  assert(hasDataKey([1], '0'));
  assert(!hasDataKey([1], '1'));
  assert(hasDataKey([{ name: 'aaa' }], '0.name'));
  assert(!hasDataKey([{ name: 'aaa' }], '0.age'));
});
