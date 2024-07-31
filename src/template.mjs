import parseDataKeyToPathList from './parseDataKeyToPathList.mjs';
import getValueOfPathList from './getValueOfPathList.mjs';
import findIndex from './findIndex.mjs';

const encodeFn = (value, pathList) => {
  if (value == null) {
    return '';
  }
  if (pathList.length === 0) {
    const type = typeof value;
    if (['number', 'string', 'boolean'].includes(type)) {
      return `${value}`;
    }
    return '';
  }
  return value;
};

const escape = (str) => {
  if (str.includes('\\')) {
    return str.replace(/(\\{|\\})/g, (a, b) => {
      if (b === '\\{') {
        return '{';
      }
      if (b === '\\}') {
        return '}';
      }
      return b;
    });
  }

  return str;
};

export default (express, encode = encodeFn) => {
  if (typeof express !== 'string') {
    return () => '';
  }
  let startOf = findIndex(express, '{{');
  if (startOf === -1) {
    return () => express;
  }
  let endOf = findIndex(express, '}}', startOf + 2);
  if (endOf === -1) {
    return () => express;
  }
  const regexp = /(?<!\\){{((?:\\}}|\\}|[^}])*?)}}/g;
  let op;
  const opList = [];
  while (op = regexp.exec(express)) { // eslint-disable-line
    const startOf = op.index;
    const endOf = op.index + op[0].length;
    const key = escape(op[1].trim());
    const d = {
      startOf,
      endOf,
      key,
    };
    if (opList.length === 0) {
      d.s = escape(express.slice(0, d.startOf));
    } else {
      const pre = opList[opList.length - 1];
      d.s = escape(express.slice(pre.endOf, d.startOf));
    }
    if (d.key === '') {
      d.encode = (data) => encode(data, [], d.key);
    } else {
      const nestedMaches = key.match(/^([^[]+)\[([^[]+)\]$/);
      if (nestedMaches) {
        const mainPathList = parseDataKeyToPathList(nestedMaches[1]);
        const subPathList = parseDataKeyToPathList(nestedMaches[2].trim());
        d.encode = (data) => {
          const subKey = getValueOfPathList(subPathList)(data);
          const subKeyType = typeof subKey;
          if (subKeyType !== 'string' && subKeyType !== 'number') {
            return '';
          }
          const pathList = [...mainPathList, subKey];
          return encode(getValueOfPathList(pathList)(data), pathList, d.key);
        };
      } else {
        const pathList = parseDataKeyToPathList(d.key);
        d.encode = (data) => encode(getValueOfPathList(pathList)(data), pathList, d.key);
      }
    }
    opList.push(d);
  }
  const len = opList.length;
  if (len === 0) {
    return () => express;
  }
  return (data) => {
    let result = '';
    for (let i = 0; i < len; i++) {
      const op = opList[i];
      result += op.s;
      if (op.encode) {
        result += op.encode(data);
      }
    }
    const last = opList[len - 1];
    return `${result}${escape(express.slice(last.endOf))}`;
  };
};
