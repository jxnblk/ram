const React = require('react')
const h = React.createElement
const log = require('electron-log')
const Layout = require('./Layout')
const Link = require('./Link')
const run = require('./spawn')
const { pushLog } = require('./updaters')

class Debug extends React.Component {
  constructor () {
    super()
    this.state = {
      args: ''
    }

    this.handleSubmit = e => {
      e.preventDefault()
      const { update, dirname } = this.props
      const [ cmd, ...args ] = this.state.args.split(' ')
      log.info('debug: ', cmd, ...args)
      update(pushLog([ cmd, ...args ].join(' ')))
      update(pushLog(''))
      this.setState({ args: '' })
      run(cmd, args, {
        cwd: dirname,
        onLog: msg => update(pushLog(msg))
      })
        .then(() => {
          log.info('debug: done', cmd, ...args)
        })
    }
  }

  render () {
    const { args } = this.state

    return h(Layout, this.props,
      h('pre', null, 'Debug Mode'),
      h(Link, {
        to: '/'
      }, 'Cancel'),
      h('form', { onSubmit: this.handleSubmit },
        h('div', null,
          h('label', { htmlFor: 'command' }, 'Command'),
          h('input', {
            name: 'command',
            value: args,
            onChange: e => {
              this.setState({ args: e.target.value })
            }
          })
        ),
        h('div', null,
          h('button', {}, 'Run')
        ),
      )
    )
  }
}

module.exports = Debug
