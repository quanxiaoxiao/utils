import assert from 'node:assert';
import test from 'node:test';

import getDataValue from './getDataValue.mjs';

test('getDataValue', () => {
  assert.equal(
    getDataValue('obj[ ]')({ obj: { name: 'ccc' }, foo: { bar: 'name' } }),
    null,
  );
  assert.equal(
    getDataValue('name')({ name: 'quan' }),
    'quan',
  );
  assert.equal(
    getDataValue('obj.name')({ obj: { name: 'quan' } }),
    'quan',
  );
  assert.equal(
    getDataValue('name')({ obj: { name: 'quan' } }),
    null,
  );
  assert.equal(
    getDataValue('na[me')({ 'na[me': 'quan' }),
    'quan',
  );
  assert.equal(
    getDataValue('na[maa[ss].name')({ 'na[me': '' }),
    null,
  );
  assert.equal(
    getDataValue('obj[foo.bar]')({ obj: { name: 'ccc' }, foo: { bar: 'name' } }),
    'ccc',
  );
  assert.equal(
    getDataValue('obj[ foo.bar]')({ obj: { name: 'ccc' }, foo: { bar: 'name' } }),
    'ccc',
  );
  assert.equal(
    getDataValue('obj[foo.bar ]')({ obj: { name: 'ccc' }, foo: { bar: 'name' } }),
    'ccc',
  );
  assert.equal(
    getDataValue('obj[ foo.bar ]')({ obj: { name: 'ccc' }, foo: { bar: 'name' } }),
    'ccc',
  );
  assert.equal(
    getDataValue('namaa[ss].name')({ namaa: { foo: { name: '123' } }, ss: 'foo' }),
    '123',
  );
  assert.equal(
    getDataValue('obj[foo.bar]')({}),
    null,
  );
  assert.equal(
    getDataValue('obj[foo.bar]')({ obj: { name: 'quan' }, foo: { bar: 'name' } }),
    'quan',
  );
  assert.equal(
    getDataValue('obj[foo.bar].name')({ obj: { ding: { name: 'quan' } }, foo: { bar: 'ding' } }),
    'quan',
  );
  assert.equal(
    getDataValue('obj[foo.bar]name')({ obj: { ding: { name: 'quan' } }, foo: { bar: 'ding' } }),
    'quan',
  );
  assert.equal(
    getDataValue('na[maa\\]ss].name')({ na: { foo: { name: '456' } }, 'maa]ss': 'foo' }),
    456,
  );
  assert.equal(
    getDataValue('obj[foo.bar]')({ obj: { 'test.aa': 'quan' }, foo: { bar: 'test.aa' } }),
    'quan',
  );
  assert.equal(
    getDataValue('obj[foo].test[big].name')({
      obj: { goo: {
        test: {
          bar: {
            name: 'quan',
          },
        },
      } },
      foo: 'goo',
      big: 'bar',
    }),
    'quan',
  );
  assert.equal(
    getDataValue('obj[foo][big].name')({
      obj: { goo: {
        bar: {
          name: 'quan',
        },
      } },
      foo: 'goo',
      big: 'bar',
    }),
    'quan',
  );
  assert.equal(
    getDataValue('obj[foo][big].name')({
      obj: { goo: {
        bar: {
          name: 'quan',
        },
      } },
      foo: 'goo',
      big: '',
    }),
    null,
  );
  assert.equal(
    getDataValue('obj[foo][big].name')({
      obj: { goo: {
        ' ': {
          name: 'quan',
        },
      } },
      foo: 'goo',
      big: ' ',
    }),
    'quan',
  );
  assert.equal(
    getDataValue('obj[foo][big].na[cc')({
      obj: { goo: {
        bar: {
          'na[cc': 'quan',
        },
      } },
      foo: 'goo',
      big: 'bar',
    }),
    'quan',
  );
  assert.equal(
    getDataValue('obj[foo][ ].name')({
      obj: { goo: {
        bar: {
          'na[cc': 'quan',
        },
      } },
      foo: 'goo',
      big: 'bar',
    }),
    null,
  );
});
