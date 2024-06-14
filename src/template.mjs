import getValueOfPathname from './getValueOfPathname.mjs';

export default (str, encode = (s) => s) => {
  return (data) => {
    if (typeof str !== 'string') {
      return '';
    }
    if (!str.includes('{{') || !str.includes('}}')) {
      return str;
    }
    const regexp = /(?<!\\){{([^}]+?)}}/g;
    const result = str.replace(regexp, (a, dataKey) => {
      const value = getValueOfPathname(dataKey.trim())(data);
      if (value == null) {
        return '';
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
