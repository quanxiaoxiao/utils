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
    tokenList.push({
      pathList: parse(str, 0, startOf),
      s: str.slice(0, startOf),
      isSub: false,
    });
  }
  {
    const s = str.slice(startOf + 1, endOf);
    if (s.trim() === '') {
      tokenList.push({
        pathList: [],
        s,
        isSub: true,
      });
    } else {
      tokenList.push({
        pathList: parse(str, startOf + 1, endOf),
        s,
        isSub: true,
      });
    }
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
      tokenList.push({
        pathList: parse(str, endOf + 1, nextStart),
        s: str.slice(endOf + 1, nextStart),
        isSub: false,
      });
    }
    startOf = nextStart;
    endOf = nextEnd;
    const s = str.slice(startOf + 1, endOf);
    if (s.trim() === '') {
      tokenList.push({
        pathList: [],
        s,
        isSub: true,
      });
    } else {
      tokenList.push({
        pathList: parse(str, startOf + 1, endOf),
        s,
        isSub: true,
      });
    }
  }
  if (endOf !== len - 1) {
    tokenList.push({
      pathList: parse(str, endOf + 1),
      s: str.slice(endOf + 1),
      isSub: false,
    });
  }
  return (data) => {
    const pathList = [];
    for (let i = 0; i < tokenList.length; i++) {
      const tokenItem = tokenList[i];
      if (tokenItem.isSub) {
        const dataKey = getValueOfPathList(tokenItem.pathList)(data);
        if (typeof dataKey !== 'string' || dataKey === '') {
          return null;
        }
        pathList.push(dataKey);
      } else {
        pathList.push(...tokenItem.pathList);
      }
    }
    return getValueOfPathList(pathList)(data);
  };
};
