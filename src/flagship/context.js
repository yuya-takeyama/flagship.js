'use strict';

export default class Context {
  constructor() {
    this.values = {};
  }

  get(key) {
    if (typeof this.values[key] === 'function') {
      return this.values[key]();
    } else {
      return this.values[key];
    }
  }

  __set(key, value) {
    this.values[key] = value;
  }
}
