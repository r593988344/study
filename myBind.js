/*
Function.prototype.myBind = function (thisArg) {
  if (typeof this !== 'function') {
    throw TypeError('Bind must be called on a function')
  }
  // 获取 myBind 传参
  const args = Array.prototype.slice.call(arguments, 1),
  // 保存this
  self = this,
  // 创建一个干净的函数，用于保存原函数的原型
  nop = function () {},
  // 绑定的函数
  bound = function() {
    // this instanceof nop, 判断是否使用 new 来调用 bound
    // 如果是 new 来调用的话，this的指向就是其实例，
    // 如果不是 new 调用的话，就改变 this 指向到指定的对象
    return self.apply(
      this instanceof nop ? this : thisArg,
      // 合并参数
      args.concat(Array.prototype.slice.call(arguments))
    )
  }
  // 箭头函数没有 prototype，箭头函数this永远指向它所在的作用域
  if (this.prototype) {
    nop.prototype = this.prototype
  }
  // 修改绑定函数的原型指向
  bound.prototype = new nop()

  return bound
}

var module = {
  x: 42,
  getX: function() {
    return this.x;
  }
}

var unboundGetX = module.getX;
boundGetX = unboundGetX.myBind(module)
console.log(boundGetX());
*/
/**
 * 原生API的aes-128-ctr加密算法,
 * 参数统一使用UnitArray, 加密过程不限于字符串, 浏览器与node端通用
 * 使用node的crypto模块与浏览器的window.crypto对象,
 * IV长度固定为16,
 * 浏览器不支持aes-256, 故使用aes-128, key长度固定为16,
 */

const str2uint = str => new TextEncoder("utf8").encode(str);
const uint2str = bf => new TextDecoder("utf8").decode(bf);
const hex2uint = hex => new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
const uint2hex = bf => Array.prototype.map.call(new Uint8Array(bf), x => x.toString(16).padStart(2, "0")).join("");

function getCryptoNode() {
  const {createCipheriv, randomBytes, createDecipheriv} = require("crypto");
  return {
    randomBytes(len) {
      return randomBytes(len);
    },
    encrypt(buf, key, iv) {
      const ci = createCipheriv("aes-128-ctr", key, iv);
      return ci.update(buf);
    },
    decrypt(buf, key, iv) {
      const di = createDecipheriv("aes-128-ctr", CI_KEY, CI_IV);
      return di.update(buf);
    },
  }
}

function getCryptoBrowser() {
  const {crypto} = window;
  return {
    randomBytes(len){
      return crypto.getRandomValues(new Uint8Array(len));
    },
    async encrypt(buf, key, iv) {
      key = await crypto.subtle.importKey("raw", key, "AES-CTR", true, ["encrypt", "decrypt"]);
      return await crypto.subtle.encrypt({"name": "AES-CTR", "counter": iv, "length": 128}, key, buf);
    },
    async decrypt(buf, key, iv) {
      key = await crypto.subtle.importKey("raw", key, "AES-CTR", true, ["encrypt", "decrypt"]);
      return await crypto.subtle.decrypt({"name": "AES-CTR", "counter": iv, "length": 128}, key, buf);
    },
  }
}
const cryptoU = typeof(window) === "undefined" ? getCryptoNode() : getCryptoBrowser();


// const CI_KEY = cryptoU.randomBytes(16); // 16 for AES-128
// const CI_IV = cryptoU.randomBytes(16); // 16
const CI_KEY = hex2uint("213b9045f6a14d5158ee9180057f6478");
const CI_IV = hex2uint("7352ab0d74d500b22758cad567f1b6f8");
console.log("key: " + uint2hex(CI_KEY));
console.log("iv: " + uint2hex(CI_IV));

const buf0 = str2uint("hello HHHHHH");
const buf1 = cryptoU.encrypt(buf0, CI_KEY, CI_IV);
console.log(uint2hex(buf1));
console.log(uint2str(cryptoU.decrypt(buf1, CI_KEY, CI_IV)));
