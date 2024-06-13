const getValue = (dataKey, obj) => {
  if (obj == null) {
    return null;
  }
  if (!Object.hasOwnProperty.call(obj, dataKey)) {
    return null;
  }
  return obj[dataKey];
};

const getArrayValue = (index, array) => {
  const len = array.length;
  if (len === 0) {
    return null;
  }
  if (index >= len) {
    return null;
  }
  if (index < 0) {
    const n = len + index;
    if (n < 0) {
      return null;
    }
    if (n > len) {
      return null;
    }
    return array[n];
  }
  return array[index];
};

const getValueOfArray = (index, array) => {
  const type = typeof index;
  if (type !== 'string' && type !== 'number') {
    return null;
  }
  if (type === 'string') {
    const n = parseInt(index, 10);
    if (Number.isNaN(n) || `${n}` !== index) {
      return null;
    }
    return getArrayValue(n, array);
  }
  if (`${index}`.includes('.')) {
    return null;
  }
  return getArrayValue(index, array);
};

const walk = (obj, nameList) => {
  const [dataKey, ...other] = nameList;
  if (Array.isArray(obj)) {
    const value = getValueOfArray(dataKey, obj);
    if (value == null) {
      return null;
    }
    if (other.length === 0) {
      return value;
    }
    return walk(value, other);
  }
  const value = getValue(dataKey, obj);
  if (value == null) {
    return null;
  }
  if (other.length === 0) {
    return value;
  }
  return walk(value, other);
};

export default (pathname) => {
  if (pathname == null) {
    return () => null;
  }
  const type = typeof pathname;
  if (type === 'number') {
    return (data) => {
      if (!Array.isArray(data)) {
        return null;
      }
      return getValueOfArray(pathname, data);
    };
  }
  if (type !== 'string') {
    return () => null;
  }
  let path = pathname;
  if (path.startsWith('.')) {
    path = pathname.slice(1);
  }
  if (path === '') {
    return (data) => data;
  }
  const nameList = path.split(/(?<!\\)\./).map((d) => d.replace(/\\\./g, '.'));
  if (nameList.length === 1) {
    return (data) => {
      if (Array.isArray(data)) {
        return getValueOfArray(nameList[0], data);
      }
      return getValue(nameList[0], data);
    };
  }
  return (data) => walk(data, nameList);
};
