const fs = require('fs')
const path = require('path')
const React = require('react')
const PropTypes = require('prop-types')
const log = require('electron-log')
const {
  Flex,
  Box,
} = require('rebass')
const Link = require('./Link')

const run = require('./spawn')
const {
  pushProject,
  openProject,
  pushLog
} = require('./updaters')
const { modes } = require('./constants')
const Layout = require('./Layout')

const { createElement: h } = React

class CreateForm extends React.Component {
  constructor (props) {
    super()
    this.state = Object.assign({}, props, {
      mode: modes.index,
      name: '',
      errors: {},
      pending: false
    })

    this.validate = () => {
      const errors = {}
      const {
        name,
        dirname,
      } = this.state
      const fulldir = path.join(dirname, name)
      if (fs.existsSync(fulldir)) {
        errors.name = 'Directory already exists'
      }
      return errors
    }

    this.handleChange = e => {
      const { name, value } = e.target
      this.setState({ [name]: value })
    }

    this.handleSubmit = e => {
      e.preventDefault()
      const errors = this.validate()
      const invalid = Object.keys(errors).length > 0
      this.setState({ errors })
      if (invalid) return log.error(errors)
      this.createApp()
    }

    this.createApp = () => {
      this.setState({ pending: true })
      const { name, dirname } = this.state
      const promise = run('npx', [ 'create-react-app', name ], {
        cwd: dirname,
        onLog: msg => {
          this.props.update(pushLog(msg))
        }
      })

      promise
        .then(({ stdout }) => {
          log.info('created app', name, stdout)
          const project = {
            name,
            dirname: path.join(dirname, name),
            created: new Date().toString()
          }
          this.props.update(pushProject(project))
          this.props.update(openProject(project.name))
          this.setState({ pending: false })
        })
        .catch(err => {
          log.error(err)
          this.setState({ pending: false })
        })
    }
  }

  render () {
    const {
      name,
      dirname,
      errors,
      pending
    } = this.state

    return (
      h(Layout, this.props,
        h(Link, { to: '/' }, 'Back'),
        h('form', {
          onSubmit: this.handleSubmit
        },
          h('h1', null, 'Create New React App'),
          h('div', null,
            h('label', { htmlFor: 'dirname' }, 'Folder'),
            h('input', {
              type: 'text',
              name: 'dirname',
              value: dirname,
              readOnly: true
            }),
            errors.dirname && h('pre', { style: { color: 'red' } }, errors.dirname)
          ),
          h('div', null,
            h('label', { htmlFor: 'name' }, 'Name'),
            h('input', {
              type: 'text',
              name: 'name',
              value: name,
              disabled: pending,
              onChange: this.handleChange
            }),
            errors.name && h('pre', { style: { color: 'red' } }, errors.name)
          ),
          h('button', {
            disabled: !name || pending
          }, 'Create App')
        )
      )
    )
  }
}

CreateForm.propTypes = {
  dirname: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
}

module.exports = CreateForm
