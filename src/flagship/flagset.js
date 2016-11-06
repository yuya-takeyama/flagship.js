'use strict';

export default class Flagset {
  constructor(key, flags, base) {
    this.key = key;
    this.flags = base ? { ...base.flags, ...flags } : flags;
  }

  enabled(key) {
    if (!(key in this.flags)) {
      throw new Error(`The flag "${key}" is not defined`);
    }

    const flag = this.flags[key];

    if (typeof flag === 'function') {
      return flag();
    } else {
      return flag;
    }
  }
}
