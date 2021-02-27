function myNew(){
  const obj = {}
  const constructorFunction = [].shift.call(arguments)
  obj.__proto__ = constructorFunction.prototype
  const params = arguments
  const res = constructorFunction.apply(obj, params)
  return res instanceof Object ? res : obj
}

function Test(val) {
  this.value = val
}

console.log(myNew(Test, 1));
