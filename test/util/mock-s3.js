var events = require('events')
var concat = require('concat-stream')

function createMockS3 () {
  function upload (opts) {
    var ee = new events.EventEmitter()

    console.log(Buffer.isBuffer(opts.Body))

    ee.send = function send (cb) {
      if (Buffer.isBuffer(opts.Body)) {
        ee.emit('httpUploadProgress', { total: opts.Body.length })
        cb(null, {
          'Location': 'mock-location',
          'ETag': 'mock-etag'
        })
      } else {
        opts['Body'].pipe(concat(function (body) {
          ee.emit('httpUploadProgress', { total: body.length })
          cb(null, {
            'Location': 'mock-location',
            'ETag': 'mock-etag'
          })
        }))
      }
    }

    return ee
  }

  return { upload: upload }
}

module.exports = createMockS3
