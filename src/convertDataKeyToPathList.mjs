import parseDataKeyToPathList from './parseDataKeyToPathList.mjs';
import getValueOfPathList from './getValueOfPathList.mjs';
import findIndex from './findIndex.mjs';

const parse = (str, startOf, endOf) => {
  const code = endOf == null ? str.slice(startOf) : str.slice(startOf, endOf);
  const pathList = parseDataKeyToPathList(code);
  return {
    code,
    pathList: pathList.map((s) => s.replaceAll('\\[', '[').replaceAll('\\]', ']')),
  };
};

export default (str) => {
  let startOf = findIndex(str, '[');
  if (startOf === -1) {
    const pathList = parseDataKeyToPathList(str);
    return (data) => getValueOfPathList(pathList)(data);
  }
  let endOf = findIndex(str, ']', startOf);
  if (endOf === -1) {
    const pathList = parseDataKeyToPathList(str);
    return (data) => getValueOfPathList(pathList)(data);
  }
  const len = str.length;
  const tokenList = [];
  if (startOf !== 0) {
    tokenList.push({
      ...parse(str, 0, startOf),
      isSub: false,
    });
  }
  tokenList.push({
    ...parse(str, startOf + 1, endOf),
    isSub: true,
  });
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
        ...parse(str, endOf + 1, nextStart),
        isSub: false,
      });
    }
    startOf = nextStart;
    endOf = nextEnd;
    tokenList.push({
      ...parse(str, startOf + 1, endOf),
      isSub: true,
    });
  }
  if (endOf !== len - 1) {
    tokenList.push({
      ...parse(str, endOf + 1),
      isSub: false,
    });
  }
  if (tokenList.length === 0) {
    return (data) => data;
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
