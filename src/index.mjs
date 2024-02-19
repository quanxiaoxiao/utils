export { default as Semaphore } from './semaphore.mjs';

export {
  getCurrentDateTime,
  getDateNow,
  getCurrentDateName,
} from './dateTime.mjs';

/**
 * @param {string} str
 * @returns {string}
 */
export const escapeString = (str) => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

/**
 * @param {Array<?>} arr
 * @param {(a: any, b: any) => number} compare
 * @return {Array<?>}
 */
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

/**
 * @template T
 * @param {Array<T>} arr
 * @param {(a:any) => number | any} compare
 * @returns {number}
 */
export const findIndex = (arr, compare) => {
  const len = arr.length;
  if (compare == null || len === 0) {
    return -1;
  }
  let left = 0;
  let right = len;
  /**
   * @type {(a: any) => number}
   */
  const fn = typeof compare === 'function'
    ? compare
    : (/** @type {any} d */ d) => {
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

/**
 * @param {number} [n]
 * @returns {Promise<void>}
 */
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

/**
 * @param {number} value
 * @param {number} [decimals=0]
 * @returns {number}
 */
export const round = (value, decimals = 0) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return NaN;
  }
  return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
};
