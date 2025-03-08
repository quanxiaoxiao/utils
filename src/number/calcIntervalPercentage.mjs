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
  const value = diff * percentage + min;
  if (step == null || step === 0) {
    return value;
  }
  let current = min;
  if (max > min) {
    const end = Math.ceil(value);
    while (current <= end) {
      const next = current + step;
      if (next === value) {
        current = next;
        break;
      }
      if (next > value) {
        if ((next - value) <= step / 2) {
          current = next;
        }
        break;
      }
      current = next;
    }
    return clamp(current, range);
  }
  const end = Math.floor(value);
  while (current >= end) {
    const next = current - step;
    if (next === value) {
      current = next;
      break;
    }
    if (next < value) {
      if ((value - next) <= step / 2) {
        current = next;
      }
      break;
    }
    current = next;
  }
  return clamp(current, range);
};
