export default (str) => {
  let pathname = str;
  if (pathname.startsWith('.')) {
    pathname = pathname.slice(1);
  }
  if (pathname === '') {
    return [];
  }
  const list = pathname.split(/(?<!\\)\./).map((d) => d.replace(/\\\./g, '.'));
  if (list.some((s) => s === '')) {
    throw new Error(`\`${str}\` parse fail`);
  }
  return list;
};
