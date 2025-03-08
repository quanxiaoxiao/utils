import parseInteger from './number/parseInteger.mjs';

export default (time, cb) => {
  let isEmit = false;
  let n;
  if (time != null) {
    n = parseInteger(time);
    if (n == null || n < 0) {
      n = 0;
    }
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
};
