import parseDataKeyToPathList from './parseDataKeyToPathList.mjs';
import getValueOfPathList from './getValueOfPathList.mjs';
import getValueOfArray from './getValueOfArray.mjs';

export default (pathname) => {
  if (pathname == null) {
    return () => null;
  }
  const type = typeof pathname;
  if (type === 'number') {
    return (data) => {
      if (!Array.isArray(data)) {
        return null;
      }
      return getValueOfArray(pathname)(data);
    };
  }
  if (type !== 'string') {
    return () => null;
  }
  return getValueOfPathList(parseDataKeyToPathList(pathname));
};
