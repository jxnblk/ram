const Store = require('electron-store')
const { name } = require('../package.json')

const store = new Store({
  name,
  defaults: {
    projects: [],
    recents: []
  }
})

module.exports = store
