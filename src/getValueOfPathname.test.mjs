import test from 'node:test';
import assert from 'node:assert';
import getValueOfPathname from './getValueOfPathname.mjs';

test('getValueOfPathname', () => {
  assert.equal(getValueOfPathname()(), null);
  assert.equal(getValueOfPathname(2)([]), null);
  assert.equal(getValueOfPathname(true)([]), null);
  assert.equal(getValueOfPathname(true)({}), null);
  assert.equal(getValueOfPathname({})({}), null);
  assert.equal(getValueOfPathname(2)('aabbcc'), null);
  assert.equal(getValueOfPathname('2')('aabbcc'), 'b');
  assert.equal(getValueOfPathname()({ name: 'aaa' }), null);
  assert.equal(getValueOfPathname(2)(['aa', 'bb', 'ccc']), 'ccc');
  assert.equal(getValueOfPathname(1.1)(['aa', 'bb', 'ccc']), null);
  assert.equal(getValueOfPathname(-1)(['aa', 'bb', 'ccc']), 'ccc');
  assert.equal(getValueOfPathname(-2)(['aa', 'bb', 'ccc']), 'bb');
  assert.equal(getValueOfPathname(-6)(['aa', 'bb', 'ccc']), null);
  assert.equal(getValueOfPathname('2')(['aa', 'bb', 'ccc']), 'ccc');
  assert.equal(getValueOfPathname('length')(['aa', 'bb', 'ccc']), 3);
  assert.equal(getValueOfPathname('.length')(['aa', 'bb', 'ccc']), 3);
  assert.equal(getValueOfPathname('.2')(['aa', 'bb', 'ccc']), 'ccc');
  assert.equal(getValueOfPathname('-1')(['aa', 'bb', 'ccc']), 'ccc');
  assert.equal(getValueOfPathname('.-1')(['aa', 'bb', 'ccc']), 'ccc');
  assert.equal(getValueOfPathname('-2')(['aa', 'bb', 'ccc']), 'bb');
  assert.equal(getValueOfPathname('.-2')(['aa', 'bb', 'ccc']), 'bb');
  assert.equal(getValueOfPathname('.-6')(['aa', 'bb', 'ccc']), null);
  assert.deepEqual(getValueOfPathname('.')({ name: 'aaa' }), { name: 'aaa'});
  assert.deepEqual(getValueOfPathname('')({ name: 'aaa' }), { name: 'aaa'});
  assert.equal(getValueOfPathname('.name')({ name: 'aaa' }), 'aaa');
  assert.equal(getValueOfPathname('name')({ name: 'aaa' }), 'aaa');
  assert.equal(getValueOfPathname('names')({ name: 'aaa' }), null);
  assert.equal(getValueOfPathname('.1')('abcd'), 'b');
  assert.equal(getValueOfPathname('.1')(11), null);
  assert.equal(getValueOfPathname('.1')(['aa', 'bb', 'cc']), 'bb');
  assert.equal(getValueOfPathname('\\.1')(['aa', 'bb', 'cc']), null);
  assert.equal(getValueOfPathname('\\.name')({ name: 'aaa' }), null);
  assert.equal(getValueOfPathname('\\.name')({ '.name': 'aaa' }), 'aaa');
  assert.equal(getValueOfPathname('.0.name')([{ name: 'aa' }, { name: 'bb' }]), 'aa');
  assert.equal(getValueOfPathname('0.name')([{ name: 'aa' }, { name: 'bb' }]), 'aa');
  assert.equal(getValueOfPathname('5.name')([{ name: 'aa' }, { name: 'bb' }]), null);
  assert.equal(getValueOfPathname('.5.name')([{ name: 'aa' }, { name: 'bb' }]), null);
  assert.equal(getValueOfPathname('obj\\.name')({ 'obj.name': 'xxx', name: 'quan', obj: { name: 'bar' } }), 'xxx');
  assert.equal(getValueOfPathname('.obj\\.name')({ 'obj.name': 'xxx', name: 'quan', obj: { name: 'bar' } }), 'xxx');
  assert.equal(getValueOfPathname('.obj.\\.name')({ obj: { '.name': 'cccc' }, '.name': 'bbb'}), 'cccc');
  assert.equal(getValueOfPathname('.obj.name')({}), null);
  assert.equal(getValueOfPathname('.obj.name')(null), null);
  assert.equal(getValueOfPathname('.obj.name')([]), null);
  assert.equal(getValueOfPathname('.obj.name')(1), null);
  assert.equal(getValueOfPathname('.obj.name')(false), null);
  assert.equal(getValueOfPathname('.list.-1.name')({
    list: [
      {
        name: 'bbb',
      },
      {
        name: 'ccc',
      },
      {
        name: 'quan',
      },
    ],
  }), 'quan');
  assert.equal(getValueOfPathname('.list.1.name')({
    list: [
      {
        name: 'bbb',
      },
      {
        name: 'ccc',
      },
      {
        name: 'quan',
      },
    ],
  }), 'ccc');
  assert.equal(getValueOfPathname('.list.8.name')({
    list: [
      {
        name: 'bbb',
      },
      {
        name: 'ccc',
      },
      {
        name: 'quan',
      },
    ],
  }), null);
  assert.equal(getValueOfPathname('.list.-1.1.name')({
    list: [
      {
        name: 'bbb',
      },
      {
        name: 'ccc',
      },
      [
        {
          name: '222',
        },
        {
          name: '333',
        },
        {
          name: '444',
        },
      ],
    ],
  }), '333');
});
