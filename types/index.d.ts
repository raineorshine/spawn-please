export = spawnPlease;
/** Spawns a child process, as long as you ask nicely.
 *
 * @param {string} command - The shell command to execute.
 * @param {string[]} [args] - An array of arguments that are given after the command.
 * @param {{ rejectOnError?: boolean, stdin?: string, stderr?: (data: string) => void, stdout?: (data: string) => void }} [options] - Options.
 * @param {any} [spawnOptions] - Options that are passed directly to child_process.spawn. Also supports stdin: string.
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
declare function spawnPlease(command: string, args?: string[] | undefined, options?: {
    rejectOnError?: boolean | undefined;
    stdin?: string | undefined;
    stderr?: ((data: string) => void) | undefined;
    stdout?: ((data: string) => void) | undefined;
} | undefined, spawnOptions?: any): Promise<{
    stdout: string;
    stderr: string;
}>;
//# sourceMappingURL=index.d.ts.map