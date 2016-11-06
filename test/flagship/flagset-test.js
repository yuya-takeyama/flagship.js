'use strict';

import assert from 'power-assert';
import Context from '../../src/flagship/context';
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
    }, new Context);

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

    describe('override by env', () => {
      beforeEach(() => {
        process.env['FLAGSHIP_TRUE_FLAG'] = '0';
        process.env['FLAGSHIP_FALSE_FLAG'] = '1';
        process.env['FLAGSHIP_FN_TRUE_FLAG'] = 'false';
        process.env['FLAGSHIP_FN_FALSE_FLAG'] = 'true';
      });

      afterEach(() => {
        delete process.env['FLAGSHIP_TRUE_FLAG'];
        delete process.env['FLAGSHIP_FALSE_FLAG'];
        delete process.env['FLAGSHIP_FN_TRUE_FLAG'];
        delete process.env['FLAGSHIP_FN_FALSE_FLAG'];
      });

      it('changes flags', function() {
        assert(this.flagset.enabled('true_flag') === false);
        assert(this.flagset.enabled('false_flag'));
        assert(this.flagset.enabled('fn_true_flag') === false);
        assert(this.flagset.enabled('fn_false_flag'));
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
      }, new Context);
    });

    it('extends base flagset', function() {
      const flagset = new Flagset('extending', {}, new Context, this.base);

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
        }, new Context, this.base);

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
        }, new Context, this.base);

        assert(flagset.enabled('new_true_flag'));
        assert(flagset.enabled('new_false_flag') === false);
        assert(flagset.enabled('new_fn_true_flag'));
        assert(flagset.enabled('new_fn_false_flag') === false);
      });
    });
  });
});
