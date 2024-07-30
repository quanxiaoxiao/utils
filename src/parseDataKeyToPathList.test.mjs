import assert from 'node:assert';
import test from 'node:test';
import parseDataKeyToPathList from './parseDataKeyToPathList.mjs';

test('parseDataKeyToPathList', () => {
  assert.deepEqual(
    parseDataKeyToPathList(''),
    [],
  );
  assert.deepEqual(
    parseDataKeyToPathList('.'),
    [],
  );
  assert.deepEqual(
    parseDataKeyToPathList('.aa'),
    ['aa'],
  );
  assert.deepEqual(
    parseDataKeyToPathList('.aa.bb.cc'),
    ['aa', 'bb', 'cc'],
  );
  assert.deepEqual(
    parseDataKeyToPathList('aa.bb.cc'),
    ['aa', 'bb', 'cc'],
  );
  assert.deepEqual(
    parseDataKeyToPathList('aa\\.bb.cc'),
    ['aa.bb', 'cc'],
  );
  assert.deepEqual(
    parseDataKeyToPathList('.\\.aa'),
    ['.aa'],
  );
  assert.deepEqual(
    parseDataKeyToPathList('\\.aa'),
    ['.aa'],
  );
  assert.deepEqual(
    parseDataKeyToPathList('aa. .bb'),
    ['aa', ' ', 'bb'],
  );
  assert.throws(() => {
    parseDataKeyToPathList('..aa');
  });
  assert.throws(() => {
    parseDataKeyToPathList('aa..bb');
  });
  assert.throws(() => {
    parseDataKeyToPathList('bb.');
  });
});
