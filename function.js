// map
Array.prototype.map = function (callbackfn, thisArg) {
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + 'is not a function');
  }
  // 转换为对象
  let O = Object(this);
  let T = thisArg;
  let len = O.length >>> 0;
  let A = new Array(len);
  for (let k = 0; k < len; k++) {
    // 在原型链上查找
    if (k in O) {
      let KValue = O[k];
      // 依次传入this，当前项，当前索引，整个数组
      let mappedValue = callbackfn.call(T, KValue, k, O);
      A[k] = mappedValue;
    }
  }
  return A;
}

// filter
Array.prototype.filter = function (callbackfn, thisArg) {
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read propety 'filter' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Funtion]") {
    throw new TypeError(callbackfn + 'is not a function');
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let resLen = 0;
  let res = [];
  for (let i = 0; i < len; i++) {
    if (i in O) {
      let element = O[i];
      if (callbackfn.call(thisArg, O[i], i, O)) {
        res[resLen++] = element;
      }
    }
  }
  return res;
}

// reduce
Array.prototype.reduce = function (callbackfn, initialValue) {
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + 'is not a function');
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let k = 0;
  let accumulator = initialValue;
  if (accumulator === undefined) {
    for (; k < len; k++) {
      // 查找原型
      if (k in O) {
        accumulator = O[k];
        k++;
        break;
      }
    }
    // 循环结束还没有退出，表述数组全为空
    throw new Error('Each element of the array is empty');
  }
  for (; k < len; k++) {
    if (k in O) {
      accumulator = callbackfn.call(undefined, accumulator, O[k], O);
    }
  }
  return accumulator;
}

/**
 * find
 */
Array.prototype.find = function (callback) {
  if (typeof callback !== 'function') throw new TypeError(`${callback} is not function`);
  for (let i = 0; i < this.length; i++) {
    if(callback(this[i])) return this[i];
  }
}

/**
 * findIndex
 */
Array.prototype.findIndex = function (callback) {
  if (typeof callback !== 'function') throw new TypeError(`${callback} is not function`);
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i)) {
      return i;
    }
  }
}

/**
 * some
 */
Array.prototype.some = function (callback) {
  if (typeof callback !== 'function') throw new TypeError(`${callback} is not function`);
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i])) return true;
  }
}

/**
 * every
 */
Array.prototype.every = function (callback) {
  if (typeof callback !== 'function') throw new TypeError(`${callback} is not function`);
  for (let i = 0; i < this.length; i++) {
    if (!callback(this[i])) return false;
  }
  return true;
}

/**
 * flat
 */
Array.prototype.flat = function () {
  let arr = [];
  this.forEach(item => {
    if (Array.isArray(item)) {
      arr = arr.concat(item.flat());
    } else {
      arr.push(item);
    }
  })
  return arr;
}

// flat
Array.prototype.flat = function() {
  return this.toString().split(',').map(item => +item);
}

// push
Array.prototype.push = function(...items) {
  let O = Object(this);
  let len = this.length >>> 0;
  let argCount = items.length >>> 0;
  // 2 ** 53 - 1 为JS表示的最大正整数
  if (len + argCount > 2 ** 53 - 1) {
    throw new TypeError('The number of array is over the max value restricted!');
  }
  for (let i = 0; i < argCount; i++) {
    O[len + 1] = items[i];
  }
  let newLength = len + argCount;
  O.length = newLength;
  return newLength;
}

// pop
Array.prototype.pop = function() {
  let O = Object(this);
  let len = this.length >>> 0;
  if (len === 0) {
    O.length = 0;
    return undefined;
  }
  len --;
  let value = O[len];
  delete O[len];
  O.length = len;
  return value;
}

// new
// 1、让实例可以访问到私有属性
// 2、让实例可以访问构造函数原型（constructor.prototype）所在原型链上的属性
// 3、如果构造函数返回的结果不是引用数据类型
function newFactory(ctor, ...args) {
  if (typeof ctor !== 'function') {
    throw 'newOperator function the first param must be a function';
  }
  let obj = new Object();
  obj.__proto__ = Object.create(ctor.prototype);
  let res = ctor.apply(obg, ...args);
  let isObject = typeof res === 'object' && typeof res !== null;
  let isFunction = typeof res === 'function';
  return isObject || isFunction ? res : obj;
}

