# spawn-please
[![npm version](https://img.shields.io/npm/v/spawn-please.svg)](https://npmjs.org/package/spawn-please)
[![Build Status](https://travis-ci.org/metaraine/spawn-please.svg?branch=master)](https://travis-ci.org/metaraine/spawn-please)

> Promisified child_process.spawn. *Supports stdin* *Rejects on stderr*

## Usage

### How this is different than the million other child_process libraries:

- Allows you to pass a string to stdin:

```js
var spawn = require('spawn-please')

spawn('cat', [], 'test')
  .then(function(output) {
    assert(output === 'test')
  })

```
- Rejects on any stderr:

```js
var spawn = require('spawn-please')

spawn('some-command-with-stderr')
  .catch(function(stderr) {
    // do something with stderr
  })
```

### Using your own Promise library

**spawn-please** uses the global Promise object by default. You may use your own Promise library by overriding the Promise property:

```js
var spawn = require('spawn-please')
spawn.Promise = require('bluebird')
```

## Install

```sh
$ npm install --save spawn-please
```

## License

ISC © [Raine Lourie](https://github.com/metaraine)
