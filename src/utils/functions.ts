const genRandom = (num: number): string => {
  const rnd = Math.random()
    .toString(36)
    .substring(2, 2 + num);
  return rnd;
};

const toNumber = (val: any) => {
  if (/^\d+$/.test(val)) return Number(val);
};

export default { genRandom, toNumber };
