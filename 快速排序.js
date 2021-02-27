const quickSort = (arr, l, r) => {
  let i = l === undefined ? 0 : l;
  let j = r === undefined ? arr.length - 1 : r;
  const x = arr[i];
  while (i < j) {
    while (i < j && x <= arr[j]) {
      j --;
    }
    if (i < j) {
      arr[i++] = arr[j]
    }
    while (i < j && x >= arr[i]) {
      i ++;
    }
    if (i < j) {
      arr[j--] = arr[i]
    }

    // 最后把 x 放回数组中
    arr[i] = x;

    quickSort(arr, l, i - 1);
    quickSort(arr, i + 1, r);
  }
}

const arr = [2,1,4,5,3,3332,34]
quickSort(arr)
console.log(arr);
