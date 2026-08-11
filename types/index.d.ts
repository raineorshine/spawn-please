/** Error rejected when a spawned process exits with a non-zero exit code. */
export declare class SpawnError extends Error {
  command: string
  args: string[]
  code: number | null
  stdout: string
  stderr: string
  /**
   * @param {string} command - The command that was executed.
   * @param {string[]} args - The arguments the command was given.
   * @param {number | null} code - The exit code, or null if the process was terminated by a signal.
   * @param {string} stdout - The collected stdout.
   * @param {string} stderr - The collected stderr.
   */
  constructor(command: string, args: string[], code: number | null, stdout: string, stderr: string)
}
/** Spawns a child process, as long as you ask nicely.
 *
 * @param {string} command - The shell command to execute.
 * @param {string[]} [args] - An array of arguments that are given after the command.
 * @param {{ rejectOnError?: boolean, stdin?: string, stderr?: (data: string) => void, stdout?: (data: string) => void }} [options] - Options.
 * @param {any} [spawnOptions] - Options that are passed directly to child_process.spawn. Also supports stdin: string.
 * @returns {Promise<{ stdout: string, stderr: string, code: number | null }>}
 */
declare const spawnPlease: (
  command: string,
  args?: string[],
  options?: {
    rejectOnError?: boolean
    stdin?: string
    stderr?: (data: string) => void
    stdout?: (data: string) => void
  },
  spawnOptions?: any,
) => Promise<{
  stdout: string
  stderr: string
  code: number | null
}>
export default spawnPlease
