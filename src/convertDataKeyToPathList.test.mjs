import test from 'node:test';
import assert from 'node:assert';
import convertDataKeyToPathList from './convertDataKeyToPathList.mjs';

test('convertDataKeyToPathList', () => {
  assert.equal(
    convertDataKeyToPathList('name')({ name: 'quan' }),
    'quan',
  );
  assert.equal(
    convertDataKeyToPathList('obj.name')({ obj: { name: 'quan' } }),
    'quan',
  );
  assert.equal(
    convertDataKeyToPathList('name')({ obj: { name: 'quan' } }),
    null,
  );
  assert.equal(
    convertDataKeyToPathList('na[me')({ 'na[me': 'quan' }),
    'quan',
  );
  assert.equal(
    convertDataKeyToPathList('na[maa[ss].name')({ 'na[me': '' }),
    null,
  );
  assert.equal(
    convertDataKeyToPathList('namaa[ss].name')({ 'namaa': { foo: { name: '123' } }, ss: 'foo' }),
    '123',
  );
  assert.equal(
    convertDataKeyToPathList('obj[foo.bar]')({}),
    null,
  );
  assert.equal(
    convertDataKeyToPathList('obj[foo.bar]')({ obj: { name: 'quan' }, foo: { bar: 'name' } }),
    'quan',
  );
  assert.equal(
    convertDataKeyToPathList('obj[foo.bar].name')({ obj: { ding: { name: 'quan' } }, foo: { bar: 'ding' } }),
    'quan',
  );
  assert.equal(
    convertDataKeyToPathList('obj[foo.bar]name')({ obj: { ding: { name: 'quan' } }, foo: { bar: 'ding' } }),
    'quan',
  );
  assert.equal(
    convertDataKeyToPathList('na[maa\\]ss].name')({ 'na': { foo: { name: '456' } }, 'maa]ss': 'foo' }),
    456,
  );
  assert.equal(
    convertDataKeyToPathList('obj[foo.bar]')({ obj: { 'test.aa': 'quan' }, foo: { bar: 'test.aa' } }),
    'quan',
  );
});
