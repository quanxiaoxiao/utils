import getValueOfPathList from './getValueOfPathList.mjs';
import parseDataKeyToPathList from './parseDataKeyToPathList.mjs';
import findIndex from './string/findIndex.mjs';

const parse = (str, startOf, endOf) => {
  const code = endOf == null ? str.slice(startOf) : str.slice(startOf, endOf);
  const pathList = parseDataKeyToPathList(code);
  return pathList.map((s) => s.replaceAll('\\[', '[').replaceAll('\\]', ']').trim());
};

const createPathListHandler = (pathList) => (data) => getValueOfPathList(pathList)(data);

export default (str) => {
  let startOf = findIndex(str, '[');
  if (startOf === -1) {
    const pathList = parseDataKeyToPathList(str);
    return createPathListHandler(pathList);
  }
  let endOf = findIndex(str, ']', startOf + 1);
  if (endOf === -1) {
    const pathList = parseDataKeyToPathList(str);
    return createPathListHandler(pathList);
  }
  if (str.slice(startOf + 1, endOf).trim() === '') {
    return () => null;
  }
  const len = str.length;
  const tokenList = [];
  if (startOf !== 0) {
    const pathList = parse(str, 0, startOf);
    tokenList.push(() => pathList);
  }
  {
    const pathList = parse(str, startOf + 1, endOf);
    tokenList.push((pre, data) => {
      const dataKey = createPathListHandler(pathList)(data);
      if (typeof dataKey !== 'string' || dataKey === '') {
        return null;
      }
      return [...pre, dataKey];
    });
  }
  while (endOf < len - 1) {
    const nextStart = findIndex(str, '[', endOf + 1);
    if (nextStart === -1) {
      break;
    }
    const nextEnd = findIndex(str, ']', nextStart + 1);
    if (nextEnd === -1) {
      break;
    }
    if (nextStart !== endOf + 1) {
      const pathList = parse(str, endOf + 1, nextStart);
      tokenList.push((pre) => [...pre, ...pathList]);
    }
    startOf = nextStart;
    endOf = nextEnd;
    if (str.slice(startOf + 1, endOf).trim() === '') {
      return () => null;
    }
    const pathList = parse(str, startOf + 1, endOf);
    tokenList.push((pre, data) => {
      const dataKey = createPathListHandler(pathList)(data);
      if (typeof dataKey !== 'string' || dataKey === '') {
        return null;
      }
      return [...pre, dataKey];
    });
  }
  if (endOf !== len - 1) {
    const pathList = parse(str, endOf + 1);
    tokenList.push((pre) => [...pre, ...pathList]);
  }
  return (data) => {
    const pathList = tokenList.reduce((acc, cur) => {
      if (acc == null) {
        return null;
      }
      return cur(acc, data);
    }, []);
    if (pathList == null) {
      return null;
    }
    return createPathListHandler(pathList)(data);
  };
};
