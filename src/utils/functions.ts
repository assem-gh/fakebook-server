const genRandom = (num: number): string => {
  const rnd = Math.random()
    .toString(36)
    .substring(2, 2 + num);
  return rnd;
};

export default { genRandom };
