import parseInteger from './number/parseInteger.mjs';

export default (time, cb) => {
  const n = Math.max(0, parseInteger(time) || 0);
  const tick = setTimeout(() => {
    cb?.();
  }, n);
  return () => {
    clearTimeout(tick);
  };
};
