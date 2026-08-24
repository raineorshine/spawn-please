import spawn from 'cross-spawn'

/** Error rejected when a spawned process exits with a non-zero exit code. */
export class SpawnError extends Error {
  /**
   * @param {string} command - The command that was executed.
   * @param {string[]} args - The arguments the command was given.
   * @param {number | null} code - The exit code, or null if the process was terminated by a signal.
   * @param {string} stdout - The collected stdout.
   * @param {string} stderr - The collected stderr.
   */
  constructor(command, args, code, stdout, stderr) {
    const commandLine = [command, ...args].join(' ')
    super(
      `Command failed${code === null ? '' : ` with exit code ${code}`}: ${commandLine}${stderr.trim() ? `\n${stderr.trim()}` : ''}`,
    )
    this.name = 'SpawnError'
    this.command = command
    this.args = args
    this.code = code
    this.stdout = stdout
    this.stderr = stderr
  }
}

/** Spawns a child process, as long as you ask nicely.
 *
 * @param {string} command - The shell command to execute.
 * @param {string[]} [args] - An array of arguments that are given after the command.
 * @param {{ rejectOnError?: boolean, stdin?: string, stderr?: (data: string) => void, stdout?: (data: string) => void }} [options] - Options.
 * @param {any} [spawnOptions] - Options that are passed directly to child_process.spawn. Also supports stdin: string.
 * @returns {Promise<{ stdout: string, stderr: string, code: number | null }>}
 */
const spawnPlease = (command, args = [], options = {}, spawnOptions = {}) => {
  const { rejectOnError = true, stdin, stdout: onStdout, stderr: onStderr } = options

  let stdout = ''
  let stderr = ''
  // stdio streams are only null when stdio is overridden in spawnOptions, which is not supported
  const child = /** @type {import('node:child_process').ChildProcessWithoutNullStreams} */ (
    spawn(command, args, spawnOptions)
  )

  return new Promise((resolve, reject) => {
    if (stdin !== undefined && stdin !== null) {
      child.stdin.write(stdin)
    }
    child.stdin.end()

    child.stdout.on('data', data => {
      stdout += data
      if (onStdout) onStdout(data)
    })

    child.stderr.on('data', data => {
      stderr += data
      if (onStderr) onStderr(data)
    })

    // a failed spawn is not an exit code, so rejectOnError does not apply
    child.on('error', reject)

    child.on('close', code => {
      if (code !== 0 && rejectOnError) {
        reject(new SpawnError(command, args, code, stdout, stderr))
      } else {
        resolve({ stdout, stderr, code })
      }
    })
  })
}

export default spawnPlease
