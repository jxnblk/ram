const React = require('react')
const h = React.createElement
const log = require('electron-log')
const {
  Box
} = require('rebass')

const {
  pushLog,
  removeProject,
  saveThumbnail
} = require('./updaters')
const run = require('./spawn')
const Link = require('./Link')
const Layout = require('./Layout')
const Preview = require('./Preview')

const REG = /localhost/
const PORT = /localhost:[0-9]{4,5}/
const getPort = str => {
  const [ url ] = PORT.exec(str)
  if (!url) return
  return parseInt(url.replace(/[a-z:]/g, ''))
}

class Project extends React.Component {
  constructor () {
    super()

    this.state = {
      child: null,
      listening: false,
    }

    this.start = () => {
      const { project, update } = this.props
      const { dirname } = project
      const promise = run('npm', [ 'start' ], {
        cwd: dirname,
        onLog: msg => {
          update(pushLog(msg))
          if (REG.test(msg)) {
            const port = getPort(msg)
            if (port !== 3000) {
              log.info('port change:', port)
            }
            this.setState({ listening: true })
          }
        }
      })

      // promise.then(res => {})
      const { child } = promise

      child.on('exit', () => {
        this.setState({ child: null, listening: false })
      })

      this.setState({ child })
    }

    this.stop = () => {
      const { child } = this.state
      if (!child || !child.kill) return
      child.kill('SIGTERM')
    }

    this.handleCapture = img => {
      const { update } = this.props
      update(saveThumbnail(img))
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
    const { child, listening } = this.state

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
      listening && h(Box, { p: 3 },
        h(Preview, {
          innerRef: ref => this.preview = ref,
          onCapture: this.handleCapture
        }),
        h('button', {
          onClick: e => {
            this.preview && this.preview.reload()
          }
        }, 'Refresh')
      ),
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
