'use strict'

const bench = require('fastbench')
const pino = require('../')
const bunyan = require('bunyan')
const fs = require('fs')
const dest = fs.createWriteStream('/dev/null')
const plogNodeStream = pino(dest).child({ a: 'property' }).child({ sub: 'child' })
delete require.cache[require.resolve('../')]
const plogDest = require('../')(pino.destination('/dev/null'))
delete require.cache[require.resolve('../')]
const plogAsync = require('../')(pino.destination({ dest: '/dev/null', sync: false, minLength: 4096 }))
  .child({ a: 'property' })
  .child({ sub: 'child' })

const max = 10
const blog = bunyan.createLogger({
  name: 'myapp',
  streams: [{
    level: 'trace',
    stream: dest
  }]
}).child({ a: 'property' }).child({ sub: 'child' })

const run = bench([
  function benchBunyanChildChild (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      blog.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchPinoChildChild (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogDest.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchPinoAsyncChildChild (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogAsync.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchPinoNodeStreamChildChild (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogNodeStream.info({ hello: 'world' })
    }
    setImmediate(cb)
  }
], 10000)

run(run)
