'use strict'

const bench = require('fastbench')
const pino = require('../../')
const fs = require('fs')
const dest = fs.createWriteStream('/dev/null')
const plog = pino(dest)
delete require.cache[require.resolve('../../')]
const plogAsync = require('../../')(pino.destination({ dest: '/dev/null', sync: false }))
delete require.cache[require.resolve('../../')]
const plogUnsafe = require('../../')({ safe: false }, dest)
delete require.cache[require.resolve('../../')]
const plogUnsafeAsync = require('../../')(
  { safe: false },
  pino.destination({ dest: '/dev/null', sync: false })
)
const plogRedact = pino({ redact: ['a.b.c'] }, dest)
delete require.cache[require.resolve('../../')]
const plogAsyncRedact = require('../../')(
  { redact: ['a.b.c'] },
  pino.destination({ dest: '/dev/null', sync: false })
)
delete require.cache[require.resolve('../../')]
const plogUnsafeRedact = require('../../')({ redact: ['a.b.c'], safe: false }, dest)
delete require.cache[require.resolve('../../')]
const plogUnsafeAsyncRedact = require('../../')(
  { redact: ['a.b.c'], safe: false },
  pino.destination({ dest: '/dev/null', sync: false })
)

const max = 10

// note that "redact me." is the same amount of bytes as the censor: "[Redacted]"

const run = bench([
  function benchPinoNoRedact (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plog.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchPinoRedact (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogRedact.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchPinoUnsafeNoRedact (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogUnsafe.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchPinoUnsafeRedact (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogUnsafeRedact.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchPinoAsyncNoRedact (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogAsync.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchPinoAsyncRedact (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogAsyncRedact.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchPinoUnsafeAsyncNoRedact (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogUnsafeAsync.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchPinoUnsafeAsyncRedact (cb) {
    /* eslint no-var: off */
    for (var i = 0; i < max; i++) {
      plogUnsafeAsyncRedact.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  }
], 10000)

run(run)
