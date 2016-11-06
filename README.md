# :triangular_flag_on_post: Flagship.js :speedboat:

Ship/unship features using flags defined with declarative DSL.

JavaScript implementation of [Flagship (Ruby)](https://github.com/yuya-takeyama/flagship)

## Installation

Run below command in a directory which has `package.json`.

```
$ npm i --save flagship
```

Or if you are using yark,

```
$ yarn add flagship
```

## Usage

### Define and use a flagset

```js
import Flagship from 'flagship';

const flagship = new Flagship;

flagship.define('app', (feature) => {
  feature.enable('stable_feature');
  feature.enable('experimental_feature', (context) => context.get('current_user').isStaff());
  feature.disable('deprecated_feature');
});

flagship.selectFlagset('app');
```

### Branch with a flag

```js
if (flagship.enabled('some_feature')) {
  // Implement the feature here
}
```

### Set context variable

```js
// Set a value
flagship.setContext('foo', 'FOO');

// Set a function
flagship.setContext('foo', () => 'FOO');
```

### Extend flagset

```js
flagship.define('common', (feature) => {
  feature.enable('stable_feature');
});

flagship.define('development', {extend: 'common'}, (feature) => {
  feature.enable('experimental_feature');
});

flagship.define('production', {extend: 'common'}, (feature) => {
  feature.disable('experimental_feature');
});

if (process.env.NODE_ENV === 'production') {
  flagship.selectFlagset('production');
} else {
  flagship.selectFlagset('development');
}
```

### Overriding flag with `process.env`

You can override flags with ENV named `FLAGSHIP_***1.

Assuming that there is a flag `"foo"`, you can override it with ENV `FLAGSHIP_FOO=1`.

## License

[The MIT License](http://opensource.org/licenses/MIT)
