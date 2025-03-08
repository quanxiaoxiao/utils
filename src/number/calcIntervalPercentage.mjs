import clamp from './clamp.mjs';

export default (percentage, range, step) => {
  const [min, max] = range;
  if (min === max) {
    return 0;
  }
  if (percentage >= 1) {
    return max;
  }
  if (percentage <= 0) {
    return min;
  }
  const diff = max - min;
  const v = diff * percentage + min;
  if (step == null || step === 0) {
    return v;
  }
  let current = min;
  if (max > min) {
    const end = Math.ceil(v);
    while (current <= end) {
      const next = current + step;
      if (next === v) {
        current = next;
        break;
      }
      if (next > v) {
        if ((next - v) <= step / 2) {
          current = next;
        }
        break;
      }
      current = next;
    }
    return clamp(current, range);
  }
  const end = Math.floor(v);
  while (current >= end) {
    const next = current - step;
    if (next === v) {
      current = next;
      break;
    }
    if (next < v) {
      if ((v - next) <= step / 2) {
        current = next;
      }
      break;
    }
    current = next;
  }
  return clamp(current, range);
};
