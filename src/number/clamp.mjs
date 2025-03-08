export default (v, [min, max]) => {
  if (min > max) {
    return Math.max(Math.min(v, min), max);
  }
  return Math.min(Math.max(v, min), max);
};
