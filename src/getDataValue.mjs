import parseDataKeyToPathList from './parseDataKeyToPathList.mjs';
import getValueOfPathList from './getValueOfPathList.mjs';
import findIndex from './findIndex.mjs';

const parse = (str, startOf, endOf) => {
  const code = endOf == null ? str.slice(startOf) : str.slice(startOf, endOf);
  const pathList = parseDataKeyToPathList(code);
  return pathList.map((s) => s.replaceAll('\\[', '[').replaceAll('\\]', ']').trim());
};

export default (str) => {
  let startOf = findIndex(str, '[');
  if (startOf === -1) {
    const pathList = parseDataKeyToPathList(str);
    return (data) => getValueOfPathList(pathList)(data);
  }
  let endOf = findIndex(str, ']', startOf + 1);
  if (endOf === -1) {
    const pathList = parseDataKeyToPathList(str);
    return (data) => getValueOfPathList(pathList)(data);
  }
  const len = str.length;
  const tokenList = [];
  if (startOf !== 0) {
    const d = {
      pathList: parse(str, 0, startOf),
      s: str.slice(0, startOf),
      isSub: false,
    };
    d.decode = () => d.pathList;
    tokenList.push(d);
  }
  {
    const s = str.slice(startOf + 1, endOf);
    if (s.trim() === '') {
      return () => null;
    }
    const d = {
      pathList: parse(str, startOf + 1, endOf),
      s,
      isSub: true,
    };
    d.decode = (pathList, data) => {
      const dataKey = getValueOfPathList(d.pathList)(data);
      if (typeof dataKey !== 'string' || dataKey === '') {
        return null;
      }
      return [...pathList, dataKey];
    };
    tokenList.push(d);
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
      const d = {
        pathList: parse(str, endOf + 1, nextStart),
        s: str.slice(endOf + 1, nextStart),
        isSub: false,
      };
      d.decode = (pathList) => [...pathList, ...d.pathList];
      tokenList.push(d);
    }
    startOf = nextStart;
    endOf = nextEnd;
    const s = str.slice(startOf + 1, endOf);
    if (s.trim() === '') {
      tokenList.push({
        pathList: [],
        s,
        decode: () => null,
        isSub: true,
      });
    } else {
      const pathList = parse(str, startOf + 1, endOf);
      tokenList.push({
        pathList,
        s,
        decode: (pre, data) => {
          const dataKey = getValueOfPathList(pathList)(data);
          if (typeof dataKey !== 'string' || dataKey === '') {
            return null;
          }
          return [...pre, dataKey];
        },
        isSub: true,
      });
    }
  }
  if (endOf !== len - 1) {
    const pathList = parse(str, endOf + 1);
    tokenList.push({
      pathList,
      s: str.slice(endOf + 1),
      decode: (pre) => [...pre, ...pathList],
      isSub: false,
    });
  }
  return (data) => {
    let pathList = [];
    for (let i = 0; i < tokenList.length; i++) {
      const tokenItem = tokenList[i];
      pathList = tokenItem.decode(pathList, data);
      if (pathList == null) {
        return null;
      }
    }
    return getValueOfPathList(pathList)(data);
  };
};
