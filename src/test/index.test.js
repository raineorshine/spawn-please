import path from 'path'
import { fileURLToPath } from 'url'
import { describe, expect, it } from 'vitest'
import spawn from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('spawn-please', () => {
  it('resolve on success', async () => {
    await spawn('true')
  })

  it('reject on fail', async () => {
    // rejects with stderr, which is a string and may be empty
    await expect(spawn('false')).rejects.toBeDefined()
  })

  it('allow errors to be ignored with rejectOnError: false', async () => {
    await spawn('false', [], { rejectOnError: false })
  })

  it('ignore stderr with rejectOnError: false', async () => {
    const { stdout, stderr } = await spawn(
      'node',
      ['./stdout-and-stderr.js'],
      { rejectOnError: false },
      { cwd: __dirname },
    )
    expect(stdout).toBe('STDOUT\n')
    expect(stderr).toBe('STDERR\n')
  })

  it('no arguments', async () => {
    const { stdout } = await spawn('env')
    expect(stdout.trim()).toMatch(/^PATH=/gm)
  })

  it('one argument', async () => {
    const { stdout } = await spawn('printf', ['hello'])
    expect(stdout).toBe('hello')
  })

  it('spawn options', async () => {
    const { stdout } = await spawn('pwd', [], {}, { cwd: __dirname })
    expect(stdout.trim()).toBe(__dirname)
  })

  it('accept stdin', async () => {
    const { stdout } = await spawn('cat', [], { stdin: 'test' })
    expect(stdout).toBe('test')
  })

  it('accept options as fourth argument and read stdin', async () => {
    const { stdout } = await spawn('cat', [], { stdin: 'test' }, { cwd: __dirname })
    expect(stdout).toBe('test')
  })

  it('only resolve stdout when fulfilled', async () => {
    const { stdout } = await spawn('node', ['./stdout-and-stderr.js'], {}, { cwd: __dirname })
    expect(stdout).toBe('STDOUT\n')
  })

  it('stream stdout and stderr', async () => {
    let stdoutOutput = ''
    let stderrOutput = ''
    await spawn(
      'node',
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
})
