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

const removeProject = (cb) => {
  dialog.showMessageBox({
    type: 'question',
    message: 'Remove project from RAM? This will remove the project from RAM, but will not delete any files.',
    buttons: [
      'Cancel',
      'Remove Project'
    ]
  }, (res) => {
    if (res === 0) return
    cb(res)
  })
}

module.exports = {
  openDirectory,
  removeProject
}
