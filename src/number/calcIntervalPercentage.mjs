import clamp from './clamp.mjs';

export default (percentage, range, step) => {
  const [min, max] = range;
  if (min === max) {
    return min;
  }
  if (percentage >= 1) {
    return max;
  }
  if (percentage <= 0) {
    return min;
  }
  const diff = max - min;
  let value = diff * percentage + min;
  if (step == null || step === 0) {
    return value;
  }
  const stepCount = Math.round((value - min) / step);
  value = min + stepCount * step;
  return clamp(value, range);
};
