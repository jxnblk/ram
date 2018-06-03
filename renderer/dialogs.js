const { app, dialog } = require('electron').remote
const homedir = app.getPath('home')

const openDirectory = (props, cb) => {
  dialog.showOpenDialog({
    defaultPath: props.dirname || homedir,
    properties: [
      'openDirectory',
      'createDirectory'
    ]
  }, ([ dirname ]) => {
    if (!dirname) return
    cb(dirname)
  })
}

module.exports = {
  openDirectory
}
