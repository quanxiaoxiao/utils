import parseInteger from './number/parseInteger.mjs';

export default (time, cb) => {
  let isEmit = false;
  if (time != null) {
    const n = parseInteger(time);
    if (n == null || n < 0) {
      return () => {};
    }
    const tick = setTimeout(() => {
      if (cb) {
        isEmit = true;
        cb();
      }
    }, n);
    return () => {
      if (!isEmit) {
        clearTimeout(tick);
      }
    };
  }
  return () => {};
};
