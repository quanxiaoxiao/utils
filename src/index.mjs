import { join } from 'node:path';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import _ from 'lodash';
import { receiveJSON } from '@quanxiaoxiao/about-http';

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

export const sha256 = (str) => createHash('sha256').update(str).digest().toString('hex');

export const parseReqData = async (ctx, validate) => { // eslint-disable-line
  try {
    const data = await receiveJSON(ctx.req);
    if (validate && !validate(data)) {
      ctx.throw(400, validate.errors ? JSON.stringify(validate.errors) : '');
    }
    return data;
  } catch (error) {
    ctx.throw(400, error.message);
  }
};

export const etag = (ctx, body) => {
  if (!body) {
    return null;
  }
  const type = typeof body;
  const output = Buffer.isBuffer(body) || type === 'string' ? body : JSON.stringify(body);
  const hash = sha256(output);
  if (ctx.get('if-none-match') !== hash) {
    ctx.set('etag', hash);
    if (type === 'object') {
      ctx.set('content-type', 'application/json');
    }
    return output;
  }
  ctx.status = 304;
  return null;
};

export const isAliasExistWithCreate = async (alias, Model) => {
  if (alias == null) {
    return false;
  }
  const v = alias.trim();
  if (v === '') {
    return false;
  }
  const matched = await Model.findOne({
    alias: v,
    invalid: {
      $ne: true,
    },
  });
  if (matched) {
    return true;
  }
  return false;
};

export const isAliasExistWithUpdate = async (item, alias, Model) => {
  if (alias == null) {
    return false;
  }
  const v = alias.trim();
  if (v === '') {
    return false;
  }
  if (item.alias === v) {
    return false;
  }
  const matched = await Model.findOne({
    alias: v,
    invalid: {
      $ne: true,
    },
  });
  if (matched) {
    return true;
  }
  return false;
};

export const json2graphqlArgs = (obj) => {
  if (!_.isPlainObject(obj)) {
    return ['{', '}'].join('\n');
  }
  const handleArray = (v) => `[${v.map((d) => {
    if (d == null) {
      return 'null';
    }
    const type = typeof d;
    if (type === 'string' || type === 'number' || type === 'boolean') {
      return JSON.stringify(d);
    }
    if (Array.isArray(d)) {
      return handleArray(d);
    }
    return json2graphqlArgs(d);
  })}]`;
  const map = {
    '[object Null]': () => null,
    '[object Number]': (v) => v,
    '[object Boolean]': (v) => v,
    '[object Object]': (v) => json2graphqlArgs(v),
    '[object String]': (v) => JSON.stringify(v),
    '[object Date]': (v) => v.getTime(),
    '[object Array]': handleArray,
    '[object Undefined]': () => null,
  };

  const args = Object
    .entries(obj)
    .map(([key, value]) => {
      const type = Object.prototype.toString.call(value);
      const handler = map[type];
      if (!handler) {
        return `${key}:null`;
      }
      return `${key}:${handler(value)}`;
    })
    .join('\n');

  return [
    '{',
    args,
    '}',
  ].join('\n');
};
