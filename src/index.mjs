import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
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
