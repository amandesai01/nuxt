import test from 'ava'
import { resolve } from 'path'
import rp from 'request-promise-native'
import { Nuxt, Builder } from '../index.js'

const port = 4009
const url = (route) => 'http://localhost:' + port + route

let nuxt = null

// Init nuxt.js and create server listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, 'fixtures/debug')
  let config = require(resolve(rootDir, 'nuxt.config.js'))
  config.rootDir = rootDir
  config.dev = false
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()

  await nuxt.listen(port, 'localhost')
})

test('Check /test/_open (open-in-editor)', async t => {
  const { body } = await rp(url('/test/_open?file=pages/index.vue'), { resolveWithFullResponse: true })
  t.is(body, 'opened in editor!')
})

test('Check /test/_open with error (open-in-editor)', async t => {
  const { body } = await rp(url('/test/_open?file='), { resolveWithFullResponse: true })
  t.is(body, 'File is not specified')
})

// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and nuxt.js', t => {
  nuxt.close()
})
