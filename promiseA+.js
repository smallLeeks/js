const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
  constructor(excutor) {
    this.status = PENDING; // 初始状态
    this.value = undefined; // fulfilled状态时 返回的信息
    this.reason = undefined; // rejected状态时 拒绝的原因
    this.onFulfilledCallbacks = []; // 存储onfulfilled函数
    this.onRejectedCallbacks = []; // 存储onRejected函数
    // 捕获excuor执行器抛出的异常
    try {
      excutor(this.resolve, this.reject);
    } catch(err) {
      this.reject(err);
    }
  }

  // 确保onFulfilled和onRejected方法异步执行，且在then方法呗调用的那一轮事件循环之后的新执行栈中执行
  resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }
    setTimeout(() => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(x => x(this.value));
      }
    });
  }

  reject(reason) {
    setTimeout(() => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(x => x(this.reason));
      }
    })
  }
}

/**
 * 
 * @param {promise} prepromise 前一个promise.then方法返回的新的promise对象
 * @param {type} x          前一个promise中onFulfilled的返回值
 * @param {type} resolve    后面promise对象的resolve方法
 * @param {type} reject     后面promise对象的reject方法
 */
function resolvePromise(nextpromise, x, resolve, reject) {
  if (nextpromise === x) {
    return reject(new TypeError('循环引用'));
  }

  let called = false; // 避免多次调用

  if (x instanceof Promise) {
    if (x.status === PENDING) {
      x.then(y => {
        resolvePromise(nextpromise, y, resolve, reject);
      }, reason => {
        reject(reason);
      })
    } else {
      x.then(resolve, reject);
    }
  } else if(x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return;
          called = true;
          resolvePromise(nextpromise, y, resolve, reject);
        }, reason => {
          if (called) return;
          called = true;
          reject(reason);
        })
      } else {
        resolve(x);
      }
    } catch (err) {
      if (called) return;
      called = true;
      reject(err); 
    }
  } else {
    resolve(x);
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  let that = this, newPromise;
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

  if (this.status === FULFILLED) { // 成功
    return newPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onFulfilled(that.value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      })
    })
  }

  if (this.status === REJECTED) { // 失败
    return newPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try { 
          let x = onRejected(that.reason);
          resolvePromise(newPromise, x, resolve, reject);
        } catch(err) {
          reject(err);
        }
      })
    })
  }

  if (this.status === PENDING) { // 等待
    return newPromise = new Promise((resolve, reject) => {
      that.onFulfilledCallbacks.push(value => {
        try {
          let x = onFulfilled(value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
      that.onRejectedCallbacks.push(reason => {
        try {
          let x = onRejected(reason);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      })
    })
  }
}

/**
 * 
 * @param {Array} promises 
 */
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let done = gen(promises.length, resolve);
    promises.forEach((promise, index) => {
      promise.then(value => {
        done(index, value);
      });
    })
  })
}

function gen() {
  let count = 0, values = [];
  return (i, value) => {
    values[i] = value;
    if (++count === length) {
      resolve(values);
    }
  }
}

Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise.then(resolve, reject);
    })
  })
}

Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
}

Promise.resolve = function(value) {
  return new Promise(resolve => {
    resolve(value);
  });
}

Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  })
}

Promise.deferred = function() {
  let defer = [];
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
}

try {
  module.exports = Promise;
} catch (error) {
  
}
