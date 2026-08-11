# spawn-please

[![npm version](https://img.shields.io/npm/v/spawn-please.svg)](https://www.npmjs.com/package/spawn-please)

Easy and small child_process.spawn.

- Promise-based
- Cross-platform
- Pass stdin as an argument
- Rejects on a non-zero exit code by default

## Install

```sh
npm install spawn-please
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
  code: number | null
}>
```

```js
import spawn from 'spawn-please'

const { stdout, stderr } = await spawn('printf', ['please?'])

assert.equal(stdout, 'please?')
assert.equal(stderr, '')
```

## Options

- `rejectOnError: boolean` - Rejects with a `SpawnError` if the process exits with a non-zero exit code. Default: true.
- `stdin: string` - Send stdin to the spawned child process.
- `stdout: (data: string) => void` - Stream stdout by chunk.
- `stderr: (data: string) => void` - Stream stderr by chunk.

## Errors

A process that exits with a non-zero exit code rejects with a `SpawnError`, which keeps the output that was collected before it failed:

```js
import spawn, { SpawnError } from 'spawn-please'

try {
  await spawn('npm', ['ls', '--json'])
} catch (err) {
  if (err instanceof SpawnError) {
    console.log(err.code) // 1
    console.log(err.stdout) // still usable, even though npm exited non-zero
  }
}
```

A process that cannot be spawned at all, e.g. the command is not installed, rejects with the underlying `ENOENT` error. `rejectOnError: false` does not apply to it, since nothing ran.

## License

ISC © [Raine Revere](https://github.com/raineorshine)
