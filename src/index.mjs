import { join } from 'node:path';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import _ from 'lodash';
import createError from 'http-errors';

export { default as Semaphore } from './semaphore.mjs';

export const escapeString = (str) => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

export const isValidObjectId = (str) => {
  if (str == null) {
    return false;
  }
  if (typeof str === 'object') {
    return /^[0-9a-fA-F]{24}$/.test(str.toString());
  }
  return /^[0-9a-fA-F]{24}$/.test(str);
};

export const getPathname = (str) => {
  if (str[0] === '~') {
    return join(homedir(), str.slice(1));
  }
  if (str[0] !== '/') {
    return join(process.cwd(), str[0] === '.' ? str.slice(0) : str);
  }
  return str;
};

export const sha256 = (str) => createHash('sha256')
  .update(str)
  .digest()
  .toString('hex');

export const etag = (ctx, body) => {
  if (body == null || body === '') {
    return null;
  }
  const method = _.get(ctx, 'method', '').toUpperCase();
  if (method !== 'GET') {
    return body;
  }
  const type = typeof body;
  const output = Buffer.isBuffer(body) || type === 'string' ? body : JSON.stringify(body);
  const hash = sha256(output);
  if (ctx.get('if-none-match') !== hash) {
    ctx.set('etag', hash);
    if (type === 'object' && !Buffer.isBuffer(body)) {
      ctx.set('content-type', 'application/json');
    }
    return output;
  }
  ctx.status = 304;
  return null;
};

export const getQuery = (args = {}, dateTimeKey = 'timeCreate') => {
  const query = {
    invalid: {
      $ne: true,
    },
  };
  const dateTimeStartKey = `${dateTimeKey}Start`;
  const dateTimeEndKey = `${dateTimeKey}End`;
  if (args[dateTimeStartKey] != null) {
    query[dateTimeKey] = {
      $gte: args[dateTimeStartKey],
    };
  }
  if (args[dateTimeEndKey] != null) {
    query[dateTimeKey] = {
      ...(query[dateTimeKey] || {}),
      $lte: args[dateTimeEndKey],
    };
  }
  return Object.keys(args).reduce((acc, dataKey) => {
    if ([dateTimeStartKey, dateTimeEndKey].includes(dataKey)) {
      return acc;
    }
    const v = args[dataKey];
    if (v == null) {
      return acc;
    }
    return {
      ...acc,
      [dataKey]: v,
    };
  }, query);
};

export const generateSortDataUpdates = (arr, input) => {
  const len = input.length;
  if (len !== input.length) {
    throw createError(400);
  }
  const updates = [];
  for (let i = 0; i < len; i++) {
    const target = input[i];
    if (!isValidObjectId(target)) {
      throw createError(400);
    }
    if (!arr.some((d) => d._id.toString() === target)) {
      throw createError(400);
    }
    updates.push({
      updateOne: {
        filter: {
          _id: target,
          invalid: {
            $ne: true,
          },
        },
        update: {
          $set: {
            order: len - i,
          },
        },
      },
    });
  }
  return updates;
};

export const sort = (arr, compare) => {
  if (!Array.isArray(arr)) {
    return [];
  }
  return [...arr].sort((a, b) => {
    if (compare) {
      return compare(a, b);
    }
    if (a === b) {
      return 0;
    }
    if (a > b) {
      return 1;
    }
    return -1;
  });
};

export const findIndex = (arr, compare) => {
  if (compare == null || _.isEmpty(arr)) {
    return -1;
  }
  const len = arr.length;
  if (len === 0) {
    return -1;
  }
  let left = 0;
  let right = len;
  const fn = typeof compare === 'function'
    ? (d) => compare(d)
    : (d) => {
      if (compare === d) {
        return 0;
      }
      if (compare > d) {
        return 1;
      }
      return -1;
    };
  while (left < right) {
    const i = left + Math.floor((right - left) / 2);
    const ret = fn(arr[i]);
    if (ret === 0) {
      return i;
    }
    if (ret > 0) {
      left = i + 1;
    } else {
      right = i;
    }
  }
  return -1;
};

export const waitFor = async (n) => {
  if (n == null || n <= 0) {
    await Promise.resolve();
  } else {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, Math.floor(n));
    });
  }
};
