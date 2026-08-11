import path from 'path'
import { fileURLToPath } from 'url'
import { expect, it } from 'vitest'
import spawn from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const node = process.execPath

it('resolve on success', async () => {
  await spawn(node, ['-e', ''])
})

it('reject on fail', async () => {
  // rejects with stderr, which is a string and may be empty
  await expect(spawn(node, ['-e', 'process.exit(1)'])).rejects.toBeDefined()
})

it('allow errors to be ignored with rejectOnError: false', async () => {
  await spawn(node, ['-e', 'process.exit(1)'], { rejectOnError: false })
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
