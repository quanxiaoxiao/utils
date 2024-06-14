import getValueOfPathname from './getValueOfPathname.mjs';

export default (str, encode = (s) => s) => {
  return (data) => {
    if (typeof str !== 'string') {
      return '';
    }
    if (!str.includes('{{') || !str.includes('}}')) {
      return str;
    }
    const regexp = /(?<!\\){{((?:\\}|[^}])*?)}}/g;
    const result = str.replace(regexp, (a, dataKey) => {
      const key = dataKey.trim();
      if (key === '') {
        return encode('');
      }
      if (/^'((?:\\'|[^])*?)'$/.test(key)) {
        return encode(RegExp.$1.replace(/\\'/g, `'`));
      }
      if (/^"((?:\\"|[^])*?)"$/.test(key)) {
        return encode(RegExp.$1.replace(/\\"/g, '"'));
      }
      const value = getValueOfPathname(key)(data);
      if (value == null) {
        return encode('');
      }
      return `${encode(value)}`;
    });
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
