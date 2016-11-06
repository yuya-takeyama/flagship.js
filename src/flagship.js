'use strict';

import Dsl from './flagship/dsl';

export default class Flagship {
  constructor() {
    this.flagsets = {};
    this.currentFlagset = null;
  }

  define(key, fn) {
    this.flagsets[key] = (new Dsl(key, fn)).getFlagset();
  }

  enabled(key) {
    if (!this.currentFlagset) {
      throw new Error('No flagset is enabled');
    }

    return this.currentFlagset.enabled(key);
  }

  selectFlagset(key) {
    if (!this.flagsets[key]) {
      throw new Error(`Flagset "${key}" is not defined`);
    }

    this.currentFlagset = this.flagsets[key];
  }
}
