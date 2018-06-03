const path = require('path')
const { ipcRenderer } = require('electron')
const { app } = require('electron').remote
const createMenu = require('functional-electron-menu')
const log = require('electron-log')
const open = require('react-dev-utils/openBrowser')
const {
  setMode,
  pushProject,
  openProject,
  removeProject
} = require('./updaters')
const dialogs = require('./dialogs')

const config = props => {
  const {
    update,
    dirname,
    pkg = {},
    recents = [],
    projects = [],
    project
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
    {
      label: 'File',
      submenu: [
        {
          label: 'New...',
          accelerator: 'Cmd+N',
          click: e => {
            update(setMode('create'))
          }
        },
        {
          label: 'Open...',
          accelerator: 'Cmd+O',
          click: e => dialogs.openDirectory({ dirname }, (dir) => {
            // todo: attempt to detect project type
            const name = path.basename(dir)
            const project = {
              name,
              dirname: dir,
              created: new Date().toString(),
              port: 3000
            }
            update(pushProject(project))
            update(openProject(project.name))
          })
        },
        /*
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
        */
        { type: 'separator' },
        { type: 'separator' },
        { role: 'close' }
      ]
    },
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
    {
      label: 'Projects',
      submenu: [
        ...projects.map(({ name }) => ({
          label: name,
          click: e => {
            update(openProject(name))
          }
        })),
        { type: 'separator' },
        {
          label: 'Remove Project',
          enabled: !!project,
          click: e => {
            dialogs.removeProject(() => {
              update(removeProject(project.name))
              update(setMode('index'))
            })
          }
        }
      ]
    },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: `${app.getName()} Help`,
          click: e => open('https://github.com/jxnblk/ram/tree/master/docs')
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
