'use strict';

import Flagset from './flagset';

export default class Dsl {
  constructor(key, definition) {
    this.key = key;
    this.flags = {};
    this.definition = definition;
  }

  enable(key, fn) {
    if (fn) {
      this.flags[key] = fn;
    } else {
      this.flags[key] = true;
    }
  }

  disable(key) {
    this.flags[key] = false;
  }

  getFlagset() {
    this.definition(this);
    return new Flagset(this.key, this.flags);
  }
}
