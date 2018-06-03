const fs = require('fs')
const url = require('url')
const path = require('path')
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const log = require('electron-log')
const Store = require('electron-store')
const { name } = require('../package.json')

log.transports.file.level = 'info'

const store = new Store({
  name,
  defaults: {
    window: {
      width: 1280,
      height: 640
    },
    dirname: app.getPath('home'),
    projects: [],
    recents: [],
  }
})

let win
const createWindow = () => {
  const opts = Object.assign({
    minWidth: 768,
    minHeight: 768,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'ultra-dark',
    webPreferences: {
      scrollBounce: true
    }
  }, store.store.window)

  win = new BrowserWindow(opts)

  const URL = url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file',
    slashes: true,
    query: {}
  })

  win.loadURL(URL)

  win.on('close', e => {
    const bounds = win.getBounds()
    store.set('window', bounds)
    win = null
  })

  win.webContents.on('will-navigate', e => {
    e.preventDefault()
  })
}

app.on('ready', () => {
  createWindow()
})

ipcMain.on('WINDOW_ERROR', (e, err) => {
  log.error(err)
})

require('update-electron-app')()
