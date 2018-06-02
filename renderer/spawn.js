const spawn = require('cross-spawn')
const log = require('electron-log')

const run = (cmd, args, opts) => {
  const child = spawn(cmd, args, opts)
  const promise = new Promise((resolve, reject) => {
    let stdout = null
    let stderr = null
    child.stdout && child.stdout.on('data', data => {
      const msg = new Buffer(data).toString()
      opts.onLog && opts.onLog(msg)
      stdout = stdout || new Buffer('')
      stdout = Buffer.concat([ stdout, data ])
    })

    child.on('error', err => {
      log.error(err)
    })

    child.on('close', code => {
      stdout = stdout && stdout.toString()
      stderr = stderr && stderr.toString()

      if (code !== 0) log.error('error')
      resolve({ stdout, stderr })
    })
  })

  promise.child = child

  return promise
}

module.exports = run
