import test from 'node:test';
import assert from 'node:assert';
import getValueOfPathList from './getValueOfPathList.mjs';

test('getValueOfArray', () => {
  assert.equal(
    getValueOfPathList(['name'])({ name: 'quan' }),
    'quan',
  );
  assert.deepEqual(
    getValueOfPathList([])({ name: 'quan' }),
    { name: 'quan' },
  );
  assert.equal(
    getValueOfPathList(['names'])({ name: 'quan' }),
    null,
  );
  assert.equal(
    getValueOfPathList(['obj', 'name'])({ name: 'quan', obj: { name: 'foo' } }),
    'foo',
  );
  assert.equal(
    getValueOfPathList(['name'])({ name: 'quan', obj: { name: 'foo' } }),
    'quan',
  );
  assert.equal(
    getValueOfPathList(['obj', 'names'])({ names: 'quan', obj: { name: 'foo' } }),
    null
  );
  assert.equal(
    getValueOfPathList(['arr', '1', 'name'])({ names: 'quan', arr: [{ name: 'foo' }, { name: 'bar' }] }),
    'bar'
  );
});
