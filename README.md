# spawn-please

[![npm version](https://img.shields.io/npm/v/spawn-please.svg)](https://npmjs.org/package/spawn-please)

Promisified child_process.spawn. \*Supports stdin* \*Rejects on stderr*

## Install

```sh
$ npm install --save spawn-please
```

## Usage

> `await spawn(command, [arguments], [stdin], [options])`

`options` are passed directly to `child_process.spawn`.

```js
const spawn = require('spawn-please')

const output = await spawn('printf', ['please?'])
assert.equal(output, 'please?')
```

### How is this different than other child_process libraries?

Allows you to pass a string on stdin:

```js
const output = await spawn('cat', [], 'test')
assert.equal(output, 'test')
```

Rejects on any stderr by default:

```js
try {
  spawn('some-command-with-stderr')
} catch (stderr) {
  // do something with stderr
}
```

Capture both stdout and stderr:

```js
let stderr = '',
  stdout = ''
spawn('some-command-with-stderr', [], undefined, {
  rejectOnError: false,
  stdout: function (data: string) {
    stdout += data
  },
  stderr: function (data: string) {
    stderr += data
  },
})
```

## License

ISC © [Raine Revere](https://github.com/raineorshine)
