const { Component, createElement: h } = require('react')
const fs = require('fs')
const path = require('path')
const log = require('electron-log')
const semver = require('semver')
const { Provider, Box } = require('rebass')

const run = require('./spawn')
const Menu = require('./Menu')
const StoreEffect = require('./StoreEffect')
const { pushLog, setMode } = require('./updaters')
const { modes } = require('./constants')
const Context = require('./Context')

// UI
const TitleBar = require('./TitleBar')
const ProjectList = require('./ProjectList')
const CreateForm = require('./CreateForm')
const Project = require('./Project')
// const Logs = require('./Logs')

const MIN_NPM_VER = '>=5.2.0'
const MIN_NODE_VER = '>=6.0.0'

class App extends Component {
  constructor (props) {
    super()
    this.state = Object.assign({}, props, {
      logs: [],
      project: null,
      update: (...args) => this.setState(...args)
    })
    // this.update = (...args) => this.setState(...args)
  }

  componentDidMount () {
    run('npm', ['-v'])
      .then(({ stdout }) => {
        const version = semver.clean(stdout)
        const compatible = semver.satisfies(version, MIN_NPM_VER)
        const npm = {
          version,
          compatible
        }
        this.state.update({ npm })
      })
      .catch(err => {
        log.error(err)
      })
    run('node', [ '-v' ])
      .then(({ stdout }) => {
        const version = semver.clean(stdout)
        const compatible = semver.satisfies(version, MIN_NODE_VER)
        const node = {
          version,
          compatible
        }
        this.state.update({ node })
      })
  }

  render () {
    const {
      mode,
      dirname,
      projects = [],
      recents = [],
      update
    } = this.state

    let view = h(ProjectList, this.state)
    switch (mode) {
      case modes.create:
        view = h(CreateForm, this.state)
        break
      case modes.detail:
        view = h(Project, this.state)
        break
    }

    return h(Provider, null,
      h(Context.Provider, { value: this.state },
        h(TitleBar, this.state),
        view,

        // h('pre', null, JSON.stringify(this.state, null, 2)),
        h(Menu, this.state),
        h(StoreEffect, this.state)
      )
    )
  }
}

module.exports = App
