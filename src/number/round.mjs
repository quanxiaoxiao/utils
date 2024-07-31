export default (value, decimals = 0) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return NaN;
  }
  if (decimals === 0) {
    return Math.round(value);
  }
  if (value.toString().includes('e')) {
    return Number(`${Math.round(Number(`${value * decimals}`))}e-${decimals}`);
  }
  return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
};
