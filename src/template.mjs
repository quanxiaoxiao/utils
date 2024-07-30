import getValueOfPathname from './getValueOfPathname.mjs';

const encodeFn = (value) => {
  if (value == null) {
    return '';
  }
  return value;
};

const getDataValue = (data, key, encode) => {
  if (key === '') {
    return encode(null, null);
  }
  if (/^'((?:\\'|[^])*?)'$/.test(key)) {
    return encode(RegExp.$1.replace(/\\'/g, `'`), null);
  }
  if (/^"((?:\\"|[^])*?)"$/.test(key)) {
    return encode(RegExp.$1.replace(/\\"/g, '"'), null);
  }
  const nestedMaches = key.match(/^([^[]+)\[([^[]+)\]$/);
  if (nestedMaches) {
    const subKey = getValueOfPathname(nestedMaches[2].trim())(data);
    const subValue = getValueOfPathname(nestedMaches[1])(data);
    if (subValue == null || subKey == null) {
      return encode(null, null);
    }
    return encode(subValue[subKey], null);
  }
  const value = getValueOfPathname(key)(data);
  return encode(value, key);
};

export default (express, encode = encodeFn) => {
  if (typeof express !== 'string') {
    return () => '';
  }
  if (!express.includes('{{') || !express.includes('}}')) {
    return () => express;
  }
  const regexp = /(?<!\\){{((?:\\}|[^}])*?)}}/g;
  return (data) => {
    const result = express.replace(regexp, (a, dataKey) => getDataValue(data, dataKey.trim(), encode));

    if (result.includes('\\')) {
      return result.replace(/(\\{|\\})/g, (a, b) => {
        if (b === '\\{') {
          return '{';
        }
        if (b === '\\}') {
          return '}';
        }
        return b;
      });
    }

    return result;
  };
};
