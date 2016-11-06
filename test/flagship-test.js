'use strict';

import assert from 'power-assert';
import Flagship from '../src/flagship';

describe('Flagship', () => {
  describe('#define', () => {
    it('defines a flagset', () => {
      const flagship = new Flagship;

      flagship.define('foo', (feature) => {
        feature.enable('bar');
      });

      assert(flagship.flagsets['foo'].enabled('bar'));
    });

    context('with "extend" option', () => {
      const flagship= new Flagship;

      flagship.define('base', (feature) => {
        feature.enable('foo');
      });

      flagship.define('extending', { extend: 'base' }, (feature) => {
        feature.enable('bar');
      });

      flagship.selectFlagset('extending');

      assert(flagship.enabled('foo'));
      assert(flagship.enabled('bar'));
    });
  });

  describe('#enabled', () => {
    context('when no flagset is selected', () => {
      it('throws error', () => {
        assert.throws(() => {
          const flagship = new Flagship;
          flagship.enabled('foo');
        });
      });
    });

    context('when a flagset is selected', () => {
      beforeEach(function() {
        this.flagship = new Flagship;

        this.flagship.define('foo', (feature) => {
          feature.enable('true_flag');
          feature.disable('false_flag');
          feature.enable('fn_true_flag', () => true);
          feature.enable('fn_false_flag', () => false);
        });

        this.flagship.selectFlagset('foo');
      });

      context('and the feature is enabled', () => {
        it('returns true', function() {
          assert(this.flagship.enabled('true_flag'));
        });
      });

      context('and the feature is disabled', () => {
        it('returns false', function() {
          assert(this.flagship.enabled('false_flag') === false);
        });
      });

      context('and the feature is enabled conditionally', () => {
        context('and the condition returns true', () => {
          it('returns true', function() {
            assert(this.flagship.enabled('fn_true_flag'));
          });
        });

        context('and the condition returns false', () => {
          it('returns false', function() {
            assert(this.flagship.enabled('fn_false_flag') === false);
          });
        });
      });
    });
  });

  describe('#setContext', () => {
    beforeEach(function() {
      this.flagship = new Flagship;
    });

    it('sets context variable which is accessible from function of #enable', function() {
      this.flagship.setContext('var', 'VAR');

      this.flagship.define('foo', (feature) => {
        feature.enable('bar', (context) => context.get('var') === 'VAR');
        feature.enable('baz', (context) => context.get('var') !== 'VAR');
      });

      this.flagship.selectFlagset('foo');

      assert(this.flagship.enabled('bar'));
      assert(this.flagship.enabled('baz') === false);
    });

    it('sets context function which is callable from function of #enable', function() {
      this.flagship.setContext('var', () => 'VAR');

      this.flagship.define('foo', (feature) => {
        feature.enable('bar', (context) => context.get('var') === 'VAR');
        feature.enable('baz', (context) => context.get('var') !== 'VAR');
      });

      this.flagship.selectFlagset('foo');

      assert(this.flagship.enabled('bar'));
      assert(this.flagship.enabled('baz') === false);
    });
  });
});
