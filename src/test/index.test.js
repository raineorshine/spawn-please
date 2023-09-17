const chai = require('chai')
const should = chai.should()
const chaiAsPromised = require('chai-as-promised')
const spawn = require('../index.js')

chai.use(chaiAsPromised)

describe('spawn-please', () => {
  it('resolve on success', async () => {
    await spawn('true')
  })

  it('reject on fail', async () => {
    return spawn('false').catch(function (err) {
      should.exist(err)
    })
  })

  it('allow errors to be ignored with rejectOnError: false', async () => {
    await spawn('false', [], { rejectOnError: false })
  })

  it('ignore stderr with rejectOnError: false', async () => {
    const { stdout, stderr } = await spawn('node', ['./stdout-and-stderr.js'], { rejectOnError: false }, { cwd: __dirname })
    stdout.should.equal('STDOUT\n')
    stderr.should.equal('STDERR\n')
  })

  it('no arguments', async () => {
    const { stdout } = await spawn('env')
    stdout.trim().should.match(/^PATH=/gm)
  })

  it('one argument', async () => {
    const { stdout } = await spawn('printf', ['hello'])
    stdout.should.equal('hello')
  })

  it('spawn options', async () => {
    const { stdout } = await spawn('pwd', [], {}, { cwd: __dirname })
    stdout.trim().should.equal(__dirname)
  })

  it('accept stdin', async () => {
    const { stdout } = await spawn('cat', [], { stdin: 'test' })
    stdout.should.equal('test')
  })

  it('accept options as fourth argument and read stdin', async () => {
    const { stdout } = await spawn('cat', [], { stdin: 'test' }, { cwd: __dirname })
    stdout.should.equal('test')
  })

  it('only resolve stdout when fulfilled', async () => {
    const { stdout } = await spawn('node', ['./stdout-and-stderr.js'], {}, { cwd: __dirname })
    stdout.should.equal('STDOUT\n')
  })

  it('stream stdout and stderr', () => {
    let stdoutOutput = ''
    let stderrOutput = ''
    return spawn('node', ['./stdout-and-stderr.js'], {
      stderr: function (data) {
        stderrOutput += data
      },
      stdout: function (data) {
        stdoutOutput += data
      },
    }, {
      cwd: __dirname
    }).then(() => {
      stderrOutput.trim().should.equal('STDERR')
      stdoutOutput.trim().should.equal('STDOUT')
    })
  })
})
