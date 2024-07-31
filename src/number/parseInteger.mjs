export default (s) => {
  const type = typeof s;
  if (type !== 'string' && type !== 'number') {
    return null;
  }
  if (type === 'number') {
    if (!Number.isInteger(s)) {
      return null;
    }
    return s;
  }
  const n = parseInt(s, 10);
  if (!Number.isInteger(n)) {
    return null;
  }
  if (`${n}` !== s) {
    return null;
  }
  return n;
};
