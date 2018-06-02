const fs = require('fs')
const path = require('path')
const React = require('react')
const PropTypes = require('prop-types')
const log = require('electron-log')
const {
  Flex,
  Box,
  Container,
  Heading,
  Text,
  NavLink,
  Button,
  Label,
  Input,
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

      const { child } = promise

      child.on('close', () => {
        log.info('created app', name)
        const project = {
          name,
          dirname: path.join(dirname, name),
          created: new Date().toString()
        }
        this.setState({ pending: false })
        if (!fs.existsSync(project.dirname)) return
        this.props.update(pushProject(project))
        this.props.update(openProject(project.name))
      })

      promise
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
        h(Box, { px: 3, pb: 4 },
          h(NavLink, { is: Link, to: '/', px: 0 }, 'Back'),
          h(Flex, {
            alignItems: 'center',
          },
            h(Heading, {
              is: 'h1',
              fontSize: 6,
            }, 'Create React App'),
            h(Box, { mx: 'auto' })
          ),
          h(Container, {
            maxWidth: 640,
            py: 4,
          },
            h('form', {
              onSubmit: this.handleSubmit
            },
              h(Box, { mb: 3 },
                h(Label, { htmlFor: 'dirname' }, 'Folder'),
                h(Input, {
                  type: 'text',
                  name: 'dirname',
                  value: dirname,
                  readOnly: true,
                  borderColor: 'lightgray'
                }),
                errors.dirname && h(Text, { color: 'red' }, errors.dirname)
              ),
              h(Box, { mb: 3 },
                h(Label, { htmlFor: 'name' }, 'Name'),
                h(Input, {
                  type: 'text',
                  name: 'name',
                  value: name,
                  disabled: pending,
                  onChange: this.handleChange,
                  borderColor: 'lightgray'
                }),
                errors.name && h(Text, { color: 'red' }, errors.name)
              ),
              h(Button, {
                color: 'black',
                bg: 'cyan',
                mr: 3,
                disabled: !name || pending
              }, 'Create App'),
              h(Button, {
                is: Link,
                to: '/',
                my: 3,
                color: 'black',
                bg: 'gray',
              }, 'Cancel'),
              pending && h(Text, { color: 'blue' }, 'Creating App...')
            )
          )
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
