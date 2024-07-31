export default (str) => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
