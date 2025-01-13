import parseDataKeyToPathList from './parseDataKeyToPathList.mjs';

export default (data, pathname, value) => {
  if (data == null) {
    return data;
  }
  if (!Array.isArray(data) && typeof data !== 'object') {
    return data;
  }
  const pathList = parseDataKeyToPathList(pathname);
  if (pathList.length === 0) {
    return data;
  }
  let currentValue = data;
  const dataList = [];
  for (let i = 0; i < pathList.length - 1; i++) {
    const key = pathList[i];
    if (!Object.hasOwnProperty.call(currentValue, key)) {
      return data;
    }
    const v = currentValue[key];
    dataList.push({
      key,
      parent: currentValue,
      value: v,
    });
    currentValue = v;
  }
  const key = pathList[pathList.length - 1];
  if (!Object.hasOwnProperty.call(currentValue, key)) {
    return data;
  }

  let result;

  if (Array.isArray(currentValue)) {
    const index = parseInt(key, 10);
    result = [
      ...currentValue.slice(0, index),
      value,
      ...currentValue.slice(index + 1),
    ];
  } else {
    result = {
      ...currentValue,
      [key]: value,
    };
  }

  while (dataList.length > 0) {
    const item = dataList.pop();
    if (Array.isArray(item.parent)) {
      const index = parseInt(item.key, 10);
      result = [
        ...item.parent.slice(0, index),
        result,
        ...item.parent.slice(index + 1),
      ];
    } else {
      result = {
        ...item.parent,
        [item.key]: result,
      };
    }
  }

  return result;
};
