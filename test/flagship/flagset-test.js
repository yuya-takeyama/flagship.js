'use strict';

import assert from 'power-assert';
import Flagset from '../../src/flagship/flagset';

describe('Flagset', () => {
  describe('#enabled', () => {
    beforeEach(function() {
      this.flagset = new Flagset('foo', {
        true_flag: true,
        false_flag: false,
        fn_true_flag: () => true,
        fn_false_flag: () => false,
      });
    });

    context('when flag is a Boolean value', () => {
      context('and the value is true', () => {
        it('is true', function() {
          assert(this.flagset.enabled('true_flag'));
        });
      });

      context('and the value is false', () => {
        it('is false', function() {
          assert(this.flagset.enabled('false_flag') === false);
        });
      });
    });

    context('when flag is a Function', () => {
      context('and it returns true', () => {
        it('is true', function() {
          assert(this.flagset.enabled('fn_true_flag'));
        });
      });

      context('and it returns false', () => {
        it('is false', function() {
          assert(this.flagset.enabled('fn_false_flag') === false);
        });
      });
    });

    context('when flag is not defined', () => {
      it('throws error', () => {
        assert.throws(() => {
          this.flagset.enabled('undefined');
        });
      });
    });
  });
});
