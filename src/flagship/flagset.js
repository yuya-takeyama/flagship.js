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

    if (typeof process === 'object' && typeof process.env === 'object') {
      const env = process.env[`FLAGSHIP_${key.toUpperCase()}`];

      switch (env) {
        case '1':
        case 'true':
          return true;

        case '0':
        case 'false':
        case '':
          return false;
      }
    }

    const flag = this.flags[key];

    if (typeof flag === 'function') {
      return flag();
    } else {
      return flag;
    }
  }
}
