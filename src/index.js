const spawn = require('cross-spawn')

/** Spawns a child process, as long as you ask nicely.
 * 
 * @param {string} command - The shell command to execute.
 * @param {string[]} [args] - An array of arguments that are given after the command.
 * @param {{ rejectOnError?: boolean, stdin?: string, stderr?: (data: string) => void, stdout?: (data: string) => void }} [options] - Options.
 * @param {any} [spawnOptions] - Options that are passed directly to child_process.spawn. Also supports stdin: string.
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
const spawnPlease = (command, args, options={}, spawnOptions={}) => {
  // defaults
  if (options.rejectOnError === undefined) {
    options.rejectOnError = true
  }

  let stdout = ''
  let stderr = ''
  const child = spawn(command, args, spawnOptions)

  return new Promise((resolve, reject) => {
    if (options.stdin !== undefined && options.stdin != null) {
      child.stdin.write(options.stdin)
    }
    child.stdin.end()

    child.stdout.on('data', data => {
      stdout += data
      if (options.stdout) options.stdout(data)
    })

    child.stderr.on('data', data => {
      stderr += data
      if (options.stderr) options.stderr(data)
    })

    if (options.rejectOnError) {
      child.addListener('error', reject)
    }

    child.on('close', code => {
      if (code !== 0 && options.rejectOnError) {
        reject(stderr)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

module.exports = spawnPlease
