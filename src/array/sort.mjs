export default (arr, compare) => {
  if (!Array.isArray(arr)) {
    return [];
  }
  return [...arr].sort((a, b) => {
    if (compare) {
      return compare(a, b);
    }
    if (a === b) {
      return 0;
    }
    if (a > b) {
      return 1;
    }
    return -1;
  });
};
