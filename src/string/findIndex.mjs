export default (str, k, startOf, endOf) => {
  const len = str.length;
  const keyLen = k.length;
  if (keyLen === 0 || keyLen > len) {
    return -1;
  }
  if (keyLen === len) {
    return str === k ? 0 : -1;
  }
  let start = 0;
  if (startOf != null) {
    start = Math.max(startOf, 0);
  }
  let end = len - 1;
  if (endOf != null) {
    end = Math.min(endOf, end);
  }
  for (let i = start; i <= end - keyLen + 1; i++) {
    const ss = str.slice(i,  i + keyLen);
    if (ss === k) {
      if (i === start) {
        return i;
      }
      if (str[i - 1] === '\\') {
        continue;
      }
      return i;
    }
  }
  return -1;
};
