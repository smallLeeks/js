/**
 * map
 */

Array.prototype.map = function (callback) {
  if (typeof callback !== "function") throw new TypeError(`${callback} is not a function`);
  let newArr = [];
  for (let i = 0; i < this.length; i++) {
    newArr.push(callback(this[i]));
  };
  return newArr;
}

/**
 * filter
 */
Array.prototype.filter = function (callback) {
  if (typeof callback !== "function") throw new TypeError(`${callback} is not a function`);
  let newArr = [];
  for (let i = 0; i < this.length; i++) {
    callback(this[i]) && newArr[this[i]];
  } 
  return newArr;
}

/**
 * reduce
 */
Array.prototype.reduce = function (reducer, initVal) {
  if (typeof callback !== "function") throw new TypeError(`${reducer} is not function`);
  for (let i = 0; i < this.length; i++) {
    initVal = reducer(initVal, this[i], i, this);
  }
  return initVal;
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
 * currying
 */
function currying() {
  let args = Array.prototype.slice.call(arguments);
  return function() {
    let newArgs = args.concat(Array.prototype.slice.call(arguments));
  }
}

