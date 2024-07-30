import getValueOfPathname from './getValueOfPathname.mjs';

const encodeFn = (value) => {
  if (value == null) {
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
  if (!express.includes('{{') || !express.includes('}}')) {
    return () => express;
  }
  const regexp = /(?<!\\){{((?:\\}|[^}])*?)}}/g;
  let op;
  const opList = [];
  while (op = regexp.exec(express)) { // eslint-disable-line
    const startOf = op.index;
    const endOf = op.index + op[0].length;
    const key = op[1].trim();
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
      d.s = `${d.s}${encode(null, null)}`;
    } else if (/^'((?:\\'|[^])*?)'$/.test(key)) {
      d.s = `${d.s}${encode(escape(RegExp.$1.replace(/\\'/g, `'`)), null)}`;
    } else if (/^"((?:\\"|[^])*?)"$/.test(key)) {
      d.s = `${d.s}${encode(escape(RegExp.$1.replace(/\\"/g, '"')), null)}`;
    } else {
      const nestedMaches = key.match(/^([^[]+)\[([^[]+)\]$/);
      if (nestedMaches) {
        d.encode = (data) => {
          const subObj = getValueOfPathname(nestedMaches[1])(data);
          const subKey = getValueOfPathname(nestedMaches[2].trim())(data);
          if (subObj == null || subKey == null) {
            return encode(null, null);
          }
          return encode(subObj[subKey], null);
        };
      } else {
        d.encode = (data) => encode(getValueOfPathname(d.key)(data), d.key);
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
