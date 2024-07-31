import test from 'node:test';
import assert from 'node:assert';
import convertDataKeyToPathList from './convertDataKeyToPathList.mjs';

/*
test('convertDataKeyToPathList', () => {
  assert.deepEqual(
    convertDataKeyToPathList('')({}),
    [],
  );
  assert.deepEqual(
    convertDataKeyToPathList('aa[cc.bb')({}),
    ['aa[cc', 'bb'],
  );
  assert.deepEqual(
    convertDataKeyToPathList('aa[quan]')({}),
    [],
  );
  assert.deepEqual(
    convertDataKeyToPathList('aa[quan][rice]')({}),
    [],
  );
  assert.deepEqual(
    convertDataKeyToPathList('aa.bb[ccc].aa')({}),
    [],
  );
  assert.deepEqual(
    convertDataKeyToPathList('aa.bb[quan.name.foo].aa')({}),
    [],
  );
  assert.deepEqual(
    convertDataKeyToPathList('aa.bb[quan].aa[bar.goo]')({}),
    [],
  );
  assert.deepEqual(
    convertDataKeyToPathList('aa.bb[quan].aa.cc[goo.ddd].eee')({
      quan: 'quan',
      goo: {
        ddd: 'foo',
      },
    }),
    [],
  );
  assert.deepEqual(
    convertDataKeyToPathList('aa.bb[quan].aa.cc[goo.ddd].eee[sss1].xxx[bb6].99')({}),
    [],
  );
});
*/

test('convertDataKeyToPathList', () => {
  assert.equal(
    convertDataKeyToPathList('name')({ name: 'quan' }),
    'quan',
  );
  assert.equal(
    convertDataKeyToPathList('na[me')({ 'na[me': 'quan' }),
    'quan',
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
});
