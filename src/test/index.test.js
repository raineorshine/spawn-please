import path from 'path'
import { fileURLToPath } from 'url'
import { expect, it } from 'vitest'
import spawn, { SpawnError } from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const node = process.execPath

it('resolve on success', async () => {
  await spawn(node, ['-e', ''])
})

it('reject on fail', async () => {
  await expect(spawn(node, ['-e', 'process.exit(1)'])).rejects.toThrow(SpawnError)
})

it('reject with the exit code and the output', async () => {
  const error = await spawn(node, ['-e', 'process.stdout.write("out"); process.stderr.write("err"); process.exit(2)'])
    .then(() => null)
    .catch(e => e)
  expect(error).toBeInstanceOf(SpawnError)
  expect(error.code).toBe(2)
  expect(error.stdout).toBe('out')
  expect(error.stderr).toBe('err')
  expect(error.message).toContain('err')
})

it('reject when the command does not exist, even with rejectOnError: false', async () => {
  await expect(spawn('spawn-please-nonexistent-command', [], { rejectOnError: false })).rejects.toThrow(/ENOENT/)
})

it('allow errors to be ignored with rejectOnError: false', async () => {
  const { code } = await spawn(node, ['-e', 'process.exit(1)'], { rejectOnError: false })
  expect(code).toBe(1)
})

it('resolve the exit code on success', async () => {
  const { code } = await spawn(node, ['-e', ''])
  expect(code).toBe(0)
})

it('do not mutate the options object', async () => {
  const options = {}
  await spawn(node, ['-e', ''], options)
  expect(options).toEqual({})
})

it('ignore stderr with rejectOnError: false', async () => {
  const { stdout, stderr } = await spawn(node, ['./stdout-and-stderr.js'], { rejectOnError: false }, { cwd: __dirname })
  expect(stdout).toBe('STDOUT\n')
  expect(stderr).toBe('STDERR\n')
})

it('no arguments', async () => {
  // node runs the program it reads from stdin when no arguments are given
  const { stdout } = await spawn(node, undefined, { stdin: 'process.stdout.write("hello")' })
  expect(stdout).toBe('hello')
})

it('one argument', async () => {
  const { stdout } = await spawn(node, ['--version'])
  expect(stdout.trim()).toBe(process.version)
})

it('spawn options', async () => {
  const { stdout } = await spawn(node, ['-p', 'process.cwd()'], {}, { cwd: __dirname })
  expect(stdout.trim()).toBe(__dirname)
})

it('accept stdin', async () => {
  const { stdout } = await spawn(node, ['-e', 'process.stdin.pipe(process.stdout)'], { stdin: 'test' })
  expect(stdout).toBe('test')
})

// larger than the pipe buffer, so the write is still pending when the child goes away
const bigStdin = 'x'.repeat(1024 * 1024)

it('resolve when the child exits without reading a large stdin', async () => {
  const { code } = await spawn(node, ['-e', 'process.exit(0)'], { stdin: bigStdin })
  expect(code).toBe(0)
})

it('reject when the command does not exist and stdin is larger than the pipe buffer', async () => {
  await expect(spawn('spawn-please-nonexistent-command', [], { stdin: bigStdin })).rejects.toThrow(/ENOENT/)
})

it('accept a stdin larger than the pipe buffer', async () => {
  const { stdout } = await spawn(node, ['-e', 'process.stdin.pipe(process.stdout)'], { stdin: bigStdin })
  expect(stdout).toBe(bigStdin)
})

it('accept options as fourth argument and read stdin', async () => {
  const { stdout } = await spawn(
    node,
    ['-e', 'process.stdin.pipe(process.stdout)'],
    { stdin: 'test' },
    { cwd: __dirname },
  )
  expect(stdout).toBe('test')
})

it('only resolve stdout when fulfilled', async () => {
  const { stdout } = await spawn(node, ['./stdout-and-stderr.js'], {}, { cwd: __dirname })
  expect(stdout).toBe('STDOUT\n')
})

it('stream stdout and stderr', async () => {
  let stdoutOutput = ''
  let stderrOutput = ''
  await spawn(
    node,
    ['./stdout-and-stderr.js'],
    {
      stderr: data => {
        stderrOutput += data
      },
      stdout: data => {
        stdoutOutput += data
      },
    },
    {
      cwd: __dirname,
    },
  )
  expect(stderrOutput.trim()).toBe('STDERR')
  expect(stdoutOutput.trim()).toBe('STDOUT')
})
