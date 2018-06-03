require('fix-path')()
const spawn = require('cross-spawn-with-kill')
const log = require('electron-log')

log.info('process.env.PATH', process.env.PATH)

const run = (cmd, args, opts = {}) => {
  const child = spawn(cmd, args, opts)
  const promise = new Promise((resolve, reject) => {
    let stdout = new Buffer('')
    let stderr = new Buffer('')

    child.stdout && child.stdout.on('data', data => {
      const msg = new Buffer(data).toString()
      opts.onLog && opts.onLog(msg)
      stdout = Buffer.concat([ stdout, data ])
    })

    child.stderr && child.stderr.on('data', data => {
      const msg = new Buffer(data).toString()
      opts.onLog && opts.onLog(msg)
      stderr = Buffer.concat([ stderr, data ])
    })

    child.on('error', err => {
      log.error(err)
      reject(err)
    })

    child.on('close', code => {
      stdout = stdout.toString()
      stderr = stderr.toString()

      if (code !== 0) log.error('error')
      resolve({ stdout, stderr })
    })
  })

  promise.child = child

  return promise
}

module.exports = run
