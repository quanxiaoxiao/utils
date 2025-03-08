export default (s) => {
  const type = typeof s;
  if (type !== 'string' && type !== 'number') {
    return null;
  }
  if (s === '') {
    return null;
  }
  if (type === 'number') {
    return Number.isInteger(s) ? s : null;
  }
  const n = parseInt(s, 10);
  return Number.isInteger(n) && `${n}` === `${s}` ? n : null;
};
