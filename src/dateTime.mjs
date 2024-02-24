export const getCurrentDateTime = () => Date.now();

export const getDateNow = () => Date.now();

export const getCurrentDateName = () => new Date(getCurrentDateTime() + 1000 * 60 * 60 * 8).toUTCString();
