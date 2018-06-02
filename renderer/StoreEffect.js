const React = require('react')
const log = require('electron-log')
const store = require('./store')

const keys = [
  'dirname',
  'projects',
  'recents',
]

class StoreEffect extends React.Component {
  componentDidUpdate (prev) {
    const next = {}
    keys.forEach(key => {
      if (this.props[key] !== prev[key]) {
        next[key] = this.props[key]
      }
    })
    store.set(next)
  }

  render () {
    return false
  }
}

module.exports = StoreEffect
