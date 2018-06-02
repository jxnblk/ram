const React = require('react')
const h = React.createElement
const log = require('electron-log')
const { pushLog, removeProject } = require('./updaters')
const run = require('./spawn')
const Link = require('./Link')
const Layout = require('./Layout')

class Project extends React.Component {
  constructor () {
    super()

    this.state = {
      child: null
    }

    this.start = () => {
      const { project, update } = this.props
      const { dirname } = project
      const promise = run('npm', [ 'start' ], {
        cwd: dirname,
        onLog: msg => {
          update(pushLog(msg))
        }
      })

      promise
        .then(() => {
          log.info('app started')
        })
      const { child } = promise

      child.on('close', () => {
        this.setState({ child: null })
      })
      child.on('exit', () => {
        this.setState({ child: null })
      })

      this.setState({ child })
    }

    this.stop = () => {
      const { child } = this.state
      if (!child || !child.kill) return
      child.kill('SIGTERM')
    }
  }

  componentWillUnmount () {
    this.stop()
  }

  render () {
    const {
      project,
      update
    } = this.props
    const { child } = this.state

    if (!project) return false
    const { name, dirname, created } = project

    return h(Layout, this.props,
      h(Link, { to: '/', }, 'Back'),
      h('h1', null, name),
      h('pre', null, `${dirname} (${created})`),
      h('button', {
        disabled: child,
        onClick: this.start
      }, 'Start'),
      h('button', {
        disabled: !child,
        onClick: this.stop
      }, 'Stop'),
      h('hr'),
      h('button', {
        onClick: e => {
          update(removeProject(name))
        }
      }, 'remove')
    )
  }
}

module.exports = Project
