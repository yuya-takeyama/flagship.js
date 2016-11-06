'use strict';

import Context from './flagship/context';
import Dsl from './flagship/dsl';

export default class Flagship {
  constructor() {
    this.flagsets = {};
    this.currentFlagset = null;
    this.context = new Context;
  }

  define(key, options, fn) {
    if (!fn) {
      fn = options;
      options = {};
    }

    const base = options.extend ? this.getFlagset(options.extend) : null;
    this.flagsets[key] = (new Dsl(key, this.context, fn, base)).getFlagset();
  }

  enabled(key) {
    if (!this.currentFlagset) {
      throw new Error('No flagset is enabled');
    }

    return this.currentFlagset.enabled(key);
  }

  selectFlagset(key) {
    this.currentFlagset = this.getFlagset(key);
  }

  getFlagset(key) {
    if (!this.flagsets[key]) {
      throw new Error(`Flagset "${key}" is not defined`);
    }

    return this.flagsets[key];
  }

  setContext(key, value) {
    this.context.__set(key, value);
  }
}
