var chai = require('chai')
var should = chai.should()
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var spawn  = require('../index.js')

describe('spawn-please', function() {

  it('should resolve', function () {
    return spawn('true')
  })

  it('should reject', function () {
    return spawn('false')
      .then(function () {
        return should.not.exist(true, 'should not resolve!')
      })
      .catch(function (err) {
        return should.exist(err)
      })
  })

  it('should handle command-line arguments', function () {
    return spawn('printf', ['hello'])
      .then(function (output) {
        return output.should.equal('hello')
      })
  })

  it('should accept stdin', function () {
    return spawn('cat', [], 'test')
      .then(function (output) {
        return output.should.equal('test')
      })
  })

})
