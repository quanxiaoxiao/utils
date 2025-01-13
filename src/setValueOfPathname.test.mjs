import assert from 'node:assert';
import test from 'node:test';

import setValueOfPathname from './setValueOfPathname.mjs';

test('setValueOfPathname', () => {
  assert.equal(setValueOfPathname(null, 'aa', 'bb'), null);
  assert.deepEqual(setValueOfPathname({}, 'aa', 'bb'), {});
  assert.deepEqual(
    setValueOfPathname({ name: 'aaa' }, 'aa', 'bb'),
    {
      name: 'aaa',
    },
  );
  let data = {
    age: 99,
    name: 'bbb',
    obj: {
      foo: 'bar',
    },
  };

  assert.deepEqual(
    setValueOfPathname(data, 'name', 'aaa'),
    {
      age: 99,
      name: 'aaa',
      obj: {
        foo: 'bar',
      },
    },
  );

  assert.deepEqual(
    data,
    {
      age: 99,
      name: 'bbb',
      obj: {
        foo: 'bar',
      },
    },
  );
  assert.deepEqual(
    setValueOfPathname(data, 'obj.bar', 'ccc'),
    {
      age: 99,
      name: 'bbb',
      obj: {
        foo: 'bar',
      },
    },
  );
});

test('setValueOfPathname2', () => {
  let data = {
    age: 99,
    name: 'bbb',
    obj: {
      foo: 'bar',
      jj: '123',
      sub: {
        cc: 'aa',
        big: 'sss',
        ding: 'xxx',
      },
    },
  };
  assert.deepEqual(
    setValueOfPathname(data, 'obj.sub.cc', '666'),
    {
      age: 99,
      name: 'bbb',
      obj: {
        foo: 'bar',
        jj: '123',
        sub: {
          cc: '666',
          big: 'sss',
          ding: 'xxx',
        },
      },
    },
  );
  assert.deepEqual(
    setValueOfPathname(data, 'obj.foo', '999'),
    {
      age: 99,
      name: 'bbb',
      obj: {
        foo: '999',
        jj: '123',
        sub: {
          cc: 'aa',
          big: 'sss',
          ding: 'xxx',
        },
      },
    },
  );

  assert.deepEqual(
    setValueOfPathname(data, 'obj', 'xxx'),
    {
      age: 99,
      name: 'bbb',
      obj: 'xxx',
    },
  );
  assert.deepEqual(
    data,
    {
      age: 99,
      name: 'bbb',
      obj: {
        foo: 'bar',
        jj: '123',
        sub: {
          cc: 'aa',
          big: 'sss',
          ding: 'xxx',
        },
      },
    },
  );
});

test('setValueOfPathname3', () => {
  assert.deepEqual(
    setValueOfPathname([
      { age: 22, foo: '111' },
      { age: 33, foo: '222' },
      { age: 45, foo: '333' },
    ], '1.age', 88),
    [
      { age: 22, foo: '111' },
      { age: 88, foo: '222' },
      { age: 45, foo: '333' },
    ],
  );

  assert.deepEqual(
    setValueOfPathname(['11', '22', '33', '44'], '2', 'ss'),
    ['11', '22', 'ss', '44'],
  );

  assert.deepEqual(
    setValueOfPathname([[11, 22, 44], [44, 55, 66], [66, 77, 88]], '1.2', 99),
    [[11, 22, 44], [44, 55, 99], [66, 77, 88]],
  );
});

test('setValueOfPathname4', () => {
  const data = {
    name: 'quan',
    list: [
      {
        index: 0,
        arr: [
          {
            name: '111',
          },
        ],
      },
      {
        index: 1,
        arr: [
          {
            name: '222',
          },
        ],
      },
      {
        index: 2,
        arr: [
          {
            name: '333',
          },
        ],
      },
    ],
  };
  assert.deepEqual(
    setValueOfPathname(
      data,
      'list.1.arr.0.name',
      'sss',
    ),
    {
      name: 'quan',
      list: [
        {
          index: 0,
          arr: [
            {
              name: '111',
            },
          ],
        },
        {
          index: 1,
          arr: [
            {
              name: 'sss',
            },
          ],
        },
        {
          index: 2,
          arr: [
            {
              name: '333',
            },
          ],
        },
      ],
    },
  );
  assert.deepEqual(
    setValueOfPathname(
      data,
      'list.0.index',
      999,
    ),
    {
      name: 'quan',
      list: [
        {
          index: 999,
          arr: [
            {
              name: '111',
            },
          ],
        },
        {
          index: 1,
          arr: [
            {
              name: '222',
            },
          ],
        },
        {
          index: 2,
          arr: [
            {
              name: '333',
            },
          ],
        },
      ],
    },
  );
});
