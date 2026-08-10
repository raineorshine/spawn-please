# spawn-please

[![npm version](https://img.shields.io/npm/v/spawn-please.svg)](https://npmjs.org/package/spawn-please)

Easy and small child_process.spawn.

- Promise-based
- Cross-platform
- Pass stdin as an argument
- Rejects on a non-zero exit code by default

## Install

```sh
$ npm install --save spawn-please
```

## Usage

```typescript
(
  command: string,
  args?: string[],
  options?: Options,
  spawnOptions?: any,
): Promise<{
  stdout: string
  stderr: string
}>
```

```js
import spawn from 'spawn-please'

const { stdout, stderr } = await spawn('printf', ['please?'])

assert.equal(stdout, 'please?')
assert.equal(stderr, '')
```

## Options

- `rejectOnError: boolean` - Rejects with stderr if the process exits with a non-zero exit code. Default: true.
- `stdin: string` - Send stdin to the spawned child process.
- `stdout: (data: string) => void` - Stream stdout by chunk.
- `stderr: (data: string) => void` - Stream stderr by chunk.

## License

ISC © [Raine Revere](https://github.com/raineorshine)
