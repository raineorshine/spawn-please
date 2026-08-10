export = spawnPlease
/** Spawns a child process, as long as you ask nicely.
 *
 * @param {string} command - The shell command to execute.
 * @param {string[]} [args] - An array of arguments that are given after the command.
 * @param {{ rejectOnError?: boolean, stdin?: string, stderr?: (data: string) => void, stdout?: (data: string) => void }} [options] - Options.
 * @param {any} [spawnOptions] - Options that are passed directly to child_process.spawn. Also supports stdin: string.
 * @returns {Promise<{ stdout: string, stderr: string }>}
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
}>
//# sourceMappingURL=index.d.ts.map
