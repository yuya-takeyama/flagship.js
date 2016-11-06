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

  describe('extending', () => {
    beforeEach(function() {
      this.base = new Flagset('base', {
        true_flag: true,
        false_flag: false,
        fn_true_flag: () => true,
        fn_false_flag: () => false,
      });
    });

    it('extends base flagset', function() {
      const flagset = new Flagset('extending', {}, this.base);

      assert(flagset.enabled('true_flag'));
      assert(flagset.enabled('false_flag') === false);
      assert(flagset.enabled('fn_true_flag'));
      assert(flagset.enabled('fn_false_flag') === false);
    });

    context('with overriding flags', () => {
      it('changes flags', function() {
        const flagset = new Flagset('extending', {
          true_flag: false,
          false_flag: true,
          fn_true_flag: () => false,
          fn_false_flag: () => true,
        }, this.base);

        assert(flagset.enabled('true_flag') === false);
        assert(flagset.enabled('false_flag'));
        assert(flagset.enabled('fn_true_flag') === false);
        assert(flagset.enabled('fn_false_flag'));
      });
    });

    context('with new flags', () => {
      it('adds flags', function() {
        const flagset = new Flagset('extending', {
          new_true_flag: true,
          new_false_flag: false,
          new_fn_true_flag: () => true,
          new_fn_false_flag: () => false,
        }, this.base);

        assert(flagset.enabled('new_true_flag'));
        assert(flagset.enabled('new_false_flag') === false);
        assert(flagset.enabled('new_fn_true_flag'));
        assert(flagset.enabled('new_fn_false_flag') === false);
      });
    });
  });
});
