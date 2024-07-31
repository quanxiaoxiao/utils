export default (arr, compare) => {
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
