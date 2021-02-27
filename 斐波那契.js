const feb = (n) => {
  let res = 1;
  const sums = (pre = 1, cur = 1) => {
    if (n === 2) return;
    n = n - 1;
    res = pre + cur;
    sums(cur, res);
  }
  sums();
  return res
}

console.log(feb(3));
