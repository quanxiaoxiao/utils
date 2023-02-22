import test from 'ava'; // eslint-disable-line
import { getQuery } from '../src/index.mjs';

test('getQuery', (t) => {
  t.deepEqual(getQuery(), {
    invalid: {
      $ne: true,
    },
  });
  t.deepEqual(getQuery({ name: 'aa' }), {
    invalid: {
      $ne: true,
    },
    name: 'aa',
  });
  t.deepEqual(getQuery({ name: null }), {
    invalid: {
      $ne: true,
    },
  });
  t.deepEqual(getQuery({
    timeCreateStart: 20,
  }), {
    invalid: {
      $ne: true,
    },
    timeCreate: {
      $gte: 20,
    },
  });
  t.deepEqual(getQuery({
    timeCreateEnd: 200,
  }), {
    invalid: {
      $ne: true,
    },
    timeCreate: {
      $lte: 200,
    },
  });
  t.deepEqual(getQuery({
    timeCreateStart: 20,
    timeCreateEnd: 200,
  }), {
    invalid: {
      $ne: true,
    },
    timeCreate: {
      $gte: 20,
      $lte: 200,
    },
  });
  t.deepEqual(getQuery({
    timeUpdateStart: 20,
  }, 'timeUpdate'), {
    invalid: {
      $ne: true,
    },
    timeUpdate: {
      $gte: 20,
    },
  });
  t.deepEqual(getQuery({
    timeUpdateEnd: 200,
  }, 'timeUpdate'), {
    invalid: {
      $ne: true,
    },
    timeUpdate: {
      $lte: 200,
    },
  });
  t.deepEqual(getQuery({
    timeUpdateStart: 20,
    timeUpdateEnd: 200,
  }, 'timeUpdate'), {
    invalid: {
      $ne: true,
    },
    timeUpdate: {
      $gte: 20,
      $lte: 200,
    },
  });
  t.deepEqual(getQuery({
    timeCreateStart: 30,
    timeUpdateStart: 20,
    timeUpdateEnd: 200,
  }, 'timeUpdate'), {
    invalid: {
      $ne: true,
    },
    timeCreateStart: 30,
    timeUpdate: {
      $gte: 20,
      $lte: 200,
    },
  });
});
