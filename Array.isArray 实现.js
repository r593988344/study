function isMyArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

console.log(isMyArray([]));
