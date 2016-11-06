'use strict';

import assert from 'power-assert';
import Context from '../../src/flagship/context';
import Dsl from '../../src/flagship/dsl';

describe('Dsl', () => {
  describe('#getFlagset', () => {
    it('creates a flagset with specified key', () => {
      const flagset = (new Dsl('foo', new Context, (feature) => {
        // noop
      })).getFlagset();
    });
  });

  describe('#enable', () => {
    context('without function', () => {
      it('enables specified feature', () => {
        const dsl = new Dsl('foo', new Context, (feature) => {
          feature.enable('bar');
        });

        assert(dsl.getFlagset().enabled('bar'));
      });
    });

    context('with function', () => {
      context('and it returns true', () => {
        it('enables specified feature', () => {
          const dsl = new Dsl('foo', new Context, (feature) => {
            feature.enable('bar', () => true);
          });

          assert(dsl.getFlagset().enabled('bar'));
        });
      });

      context('and it returns false', () => {
        it('disables specified feature', () => {
          const dsl = new Dsl('foo', new Context, (feature) => {
            feature.enable('bar', () => false);
          });

          assert(dsl.getFlagset().enabled('bar') === false);
        });
      });
    });
  });

  describe('#disable', () => {
    it('disables specified feature', () => {
      const dsl = new Dsl('foo', new Context, (feature) => {
        feature.disable('bar');
      });

      assert(dsl.getFlagset().enabled('bar') === false);
    });
  });
});
