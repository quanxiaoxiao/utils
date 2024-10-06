import parseDataKeyToPathList from './parseDataKeyToPathList.mjs';

export default (obj, dataKey) => {
  if (!obj) {
    return false;
  }
  const pathList = parseDataKeyToPathList(dataKey);
  if (pathList.length === 0) {
    return false;
  }
  let currentValue = obj;
  for (let i = 0; i < pathList.length; i++) {
    const pathname = pathList[i];
    if (!Object.hasOwnProperty.call(currentValue, pathname)) {
      return false;
    }
    currentValue = currentValue[pathname];
  }
  return true;
};
