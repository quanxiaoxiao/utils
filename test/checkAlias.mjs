import test from 'ava'; // eslint-disable-line
import {
  isAliasExistWithCreate,
  isAliasExistWithUpdate,
} from '../src/index.mjs';

const Model = {
  list: [
    {
      _id: '1',
      alias: 'aaa',
      invalid: false,
    },
    {
      _id: '2',
      alias: 'bbb',
      invalid: true,
    },
  ],
  findOne: async (query) => {
    const ret = Model.list.find((d) => {
      if (d.alias !== query.alias) {
        return false;
      }
      if (query.invalid && query.invalid.$ne === true) {
        return d.invalid !== true;
      }
      return true;
    });
    return ret || null;
  },
};
test('query', async (t) => {
  let ret = await Model.findOne({
    alias: 'aaa',
    invalid: {
      $ne: true,
    },
  });
  t.true(!!ret);
  ret = await Model.findOne({
    alias: 'aaa',
  });
  t.true(!!ret);
  ret = await Model.findOne({
    alias: 'bbb',
    invalid: {
      $ne: true,
    },
  });
  t.is(ret, null);
  ret = await Model.findOne({
    alias: 'bbb',
  });
  t.true(!!ret);
  ret = await Model.findOne({
    alias: 'ccc',
  });
  t.is(ret, null);
  ret = await Model.findOne({
    alias: 'ccc',
    invalid: {
      $ne: true,
    },
  });
  t.is(ret, null);
});

test('isAliasExistWithCreate', async (t) => {
  let ret = await isAliasExistWithCreate('aaa', Model);
  t.true(ret);
  ret = await isAliasExistWithCreate(' aaa', Model);
  t.true(ret);
  ret = await isAliasExistWithCreate('bbb', Model);
  t.false(ret);
  ret = await isAliasExistWithCreate('ccc', Model);
  t.false(ret);
});

test('isAliasExistWithUpdate', async (t) => {
  let ret = await isAliasExistWithUpdate({
    _id: '1',
    alias: 'aaa',
  }, 'aaa', Model);
  t.false(ret);
  ret = await isAliasExistWithUpdate({
    _id: '1',
    alias: 'aaa',
  }, 'aaa ', Model);
  t.false(ret);
  ret = await isAliasExistWithUpdate({
    _id: '1',
    alias: 'aaa',
  }, ' aaa', Model);
  t.false(ret);
  ret = await isAliasExistWithUpdate({
    _id: '1',
    alias: 'aaa',
  }, 'bbb', Model);
  t.false(ret);
  ret = await isAliasExistWithUpdate({
    _id: '2',
    alias: 'bbb',
  }, 'bbb', Model);
  t.false(ret);
  ret = await isAliasExistWithUpdate({
    _id: '2',
    alias: 'bbb',
  }, 'aaa', Model);
  t.true(ret);
});
