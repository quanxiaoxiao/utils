export default async (n) => {
  if (n == null || n <= 0) {
    await Promise.resolve(0);
  } else {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(n);
      }, Math.floor(n));
    });
  }
};
