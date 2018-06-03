const path = require('path')
const { ipcRenderer } = require('electron')
const { app } = require('electron').remote
const createMenu = require('functional-electron-menu')
const log = require('electron-log')
const open = require('react-dev-utils/openBrowser')
const { setMode } = require('./updaters')

const config = props => {
  const {
    update,
    dirname,
    pkg = {},
    store: {
      recents = [],
      projects = [],
    } = {},
  } = props

  return [
    {
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    /*
     * todo
      {
        label: 'File',
        submenu: [
          {
            label: 'New...',
            visible: false,
            accelerator: 'Cmd+N',
            click: e => dialogs.newProject(props, (err, dirname) => {
              alert(dirname)
              // todo create new file in folder
            })
          },
          {
            label: 'Open...',
            accelerator: 'Cmd+O',
            click: e => dialogs.openDirectory(props, (err, dirname) => {
              update(openDirectory(dirname))
            })
          },
          {
            visible: false,
            label: 'Open Recent',
            submenu: [
              ...recents.map(file => ({
                label: path.basename(file),
                click: e => {
                  update(openDirectory(file))
                }
              })),
              { type: 'separator' },
              {
                label: 'Clear List',
                click: e => {
                  update(setStore({ recents: [] }))
                }
              }
            ]
          },
          { type: 'separator' },
          { type: 'separator' },
          { role: 'close' }
        ]
      },
    */
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ]
    },
    /* todo
      {
        label: 'npm',
        submenu: [
          {
            label: 'Install Dependency',
            enabled: !!pkg,
            click: e => {
              alert('todo')
            }
          }
        ]
      },
    */
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: `${app.getName()} Help`,
          click: e => open('https://github.com/c8r/ram/tree/master/docs')
        },
        {
          label: 'Create React App Help',
          click: e => open('https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md')
        },
        { type: 'separator' },
        { role: 'toggledevtools' },
        { role: 'reload' },
        {
          visible: false,
          label: 'Debug',
          click: e => update(setMode('debug'))
        }
      ]
    }
  ]
}

const menu = createMenu(config)

module.exports = props => {
  menu(props)
  return false
}
