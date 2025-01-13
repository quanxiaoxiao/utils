const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

export default (arr) => {
  const len = arr.length;
  if (len === 0) {
    return [];
  }
  const list = [...arr];
  for (let i = 0; i < len; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    if (i !== j) {
      swap(list, i, j);
    }
  }
  return list;
};
