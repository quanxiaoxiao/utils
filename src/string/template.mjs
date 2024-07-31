import getDataValue from '../getDataValue.mjs';
import findIndex from './findIndex.mjs';

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

export default (express) => {
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
  const opList = [];
  opList.push({
    startOf,
    endOf,
    s: express.slice(startOf + 2, endOf).trim(),
    decode: getDataValue(escape(express.slice(startOf + 2, endOf).trim())),
  });
  const size = express.length;
  while (endOf < size - 2) {
    const nextStart = findIndex(express, '{{', endOf + 2);
    if (nextStart === -1) {
      break;
    }
    const nextEnd = findIndex(express, '}}', nextStart + 2);
    if (nextEnd === -1) {
      break;
    }
    startOf = nextStart;
    endOf = nextEnd;
    opList.push({
      startOf,
      endOf,
      s: express.slice(startOf + 2, endOf).trim(),
      decode: getDataValue(escape(express.slice(startOf + 2, endOf).trim())),
    });
  }
  const len = opList.length;
  return (data) => {
    let result = '';
    const [first] = opList;
    if (first.startOf !== 0) {
      result += escape(express.slice(0, first.startOf));
    }
    result += first.decode(data) ?? '';
    for (let i = 1; i < len; i++) {
      const op = opList[i];
      const pre = opList[i - 1];
      if (op.startOf !== pre.endOf + 2) {
        result += escape(express.slice(pre.endOf + 2, op.startOf));
      }
      result += op.decode(data) ?? '';
    }
    const last = opList[len - 1];
    if (last.endOf + 2 !== size) {
      return `${result}${escape(express.slice(last.endOf + 2))}`;
    }
    return result;
  };
};
