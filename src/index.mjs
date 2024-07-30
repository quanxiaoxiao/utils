export { default as round } from './round.mjs';

export { default as Semaphore } from './semaphore.mjs';

export { default as getValueOfPathname } from './getValueOfPathname.mjs';

export { default as template } from './template.mjs';

export { default as parseInteger } from './parseInteger.mjs';

export const escapeString = (str) => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

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
  const len = arr.length;
  if (compare == null || len === 0) {
    return -1;
  }
  let left = 0;
  let right = len;
  const fn = typeof compare === 'function'
    ? compare
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
        resolve(n);
      }, Math.floor(n));
    });
  }
};
