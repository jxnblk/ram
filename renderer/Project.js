const React = require('react')
const h = React.createElement
const log = require('electron-log')
const open = require('opn')
const openBrowser = require('react-dev-utils/openBrowser')
const killPort = require('kill-port')
const readPkg = require('read-pkg-up')
const {
  Box,
  Flex,
  Heading,
  NavLink,
  Link: RebassLink,
  BlockLink,
  Text,
  Code,
  Pre,
  Button,
  ButtonTransparent,
  Image,
  Input,
  Label,
} = require('rebass')
// const RefreshIcon = require('rmdi/lib/Refresh').default
const Dependencies = require('./Dependencies')

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

const InstallForm = ({
  name,
  value,
  disabled,
  onChange,
  onSubmit
}) => (
  h(Flex, {
    is: 'form',
    py: 2,
    onSubmit,
    alignItems: 'baseline'
  },
    h(Label, { htmlFor: name, fontSize: 0 }, 'Add dependency:'),
    h(Input, {
      width: 192,
      ml: 2,
      name,
      value,
      onChange,
      disabled,
      fontSize: 0,
      style: {
        fontFamily: 'Menlo, monospace'
      }
    }),
    h(Button, {
      disabled,
      ml: 2,
      fontSize: 0,
      color: 'black',
      bg: value ? 'cyan' : 'gray'
    }, 'Install')
  )
)

class Project extends React.Component {
  constructor () {
    super()

    this.state = {
      child: null,
      listening: false,
      installing: false,
      packages: '',
    }

    this.start = async () => {
      const { project, update } = this.props
      const {
        dirname,
        port = 3000
      } = project
      const killed = await killPort(port)
      const args = project.run ? project.run.split(' ') : [ 'start' ]

      update(pushLog([ 'npm', ...args ].join(' ')))
      const promise = run('npm', args, {
        cwd: dirname,
        onLog: msg => {
          update(pushLog(msg))
          if (REG.test(msg)) {
            // todo: handle port mismatches
            const outPort = getPort(msg)
            if (outPort !== port) {
              log.info('port change:', outPort)
            }
            this.setState({ listening: true })
          }
        }
      })

      promise.catch(err => {
        this.setState({ listening: false })
      })

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

    this.readPkg = async () => {
      const { update, project } = this.props
      const { dirname } = project
      if (!dirname) return
      const { pkg } = await readPkg({ cwd: dirname })
      update({ pkg })
    }

    this.handleChange = e => {
      const { name, value } = e.target
      this.setState({ [name]: value })
    }

    this.handleInstallSubmit = e => {
      e.preventDefault()
      const { update, project: { dirname } } = this.props
      const { packages } = this.state
      if (!packages) return
      log.info('installing packages', packages.split(' '))
      this.setState({ installing: true })
      update(pushLog('npm install ' + packages))
      run('npm', [ 'install', ...packages.split(' ') ], {
        cwd: dirname,
        onLog: msg => {
          update(pushLog(msg))
        }
      })
        .then(() => {
          log.info('installed', packages)
          this.setState({
            installing: false,
            packages: ''
          })
          this.readPkg()
        })
        .catch(err => {
          update({ err: err.toString() })
          this.setState({ installing: false })
        })
    }
  }

  componentDidMount () {
    this.readPkg()
  }

  componentWillUnmount () {
    this.props.update({ pkg: null })
    this.stop()
  }

  render () {
    const {
      project,
      pkg,
      update,
    } = this.props
    const {
      child,
      listening,
      installing,
      packages,
    } = this.state

    if (!project) return false
    const { name, dirname, created, port = 3000 } = project
    const url = `http://localhost:${port}`

    return h(Layout, this.props,
      h(Box, {
        px: 3,
        pb: 4,
      },
        h(NavLink, { is: Link, to: '/', px: 0 }, 'Back'),
        h(Flex, {
          alignItems: 'center'
        },
          h(Box, {},
            h(Heading, {
              is: 'h1',
              fontSize: 6,
            }, name),
          ),
          h(Box, { mx: 'auto' }),
          h(Button, {
            onClick: this.start,
            disabled: child,
            color: 'black',
            bg: 'cyan'
          }, 'Start'),
          h(Button, {
            disabled: !child,
            onClick: this.stop,
            ml: 3,
            color: 'black',
            bg: 'magenta',
            style: {
            }
          }, 'Stop')
        ),
        h(Flex, { alignItems: 'baseline', mb: 4 },
          h(Pre, { fontSize: 0 },
            dirname,
            ' ',
            h(RebassLink, {
              fontSize: 0,
              href: '#!',
              onClick: e => {
                e.preventDefault()
                open(`file://${dirname}`)
              }
            }, 'Open in Finder'),
            ' ',
            h(RebassLink, {
              href: '#!',
              disabled: !listening,
              color: listening ? 'cyan' : 'darken',
              onClick: e => openBrowser(url),
              children: url
            })
          ),
          h(Box, { mx: 'auto' }),
          h(Text, { fontSize: 1, my: 2 },
            'This will run: ',
            h(Code, { color: 'cyan' }, 'npm ' + project.run || 'start')
          )
        ),
        h(Flex, { mx: -3 },
          h(Box, { px: 3, flex: 'none' },
            listening ? (
              h(Preview, {
                  innerRef: ref => this.preview = ref,
                  onCapture: this.handleCapture,
                  port
                })
            ) : (
              project.thumbnail
                ? h(Image, {
                  src: project.thumbnail,
                  width: 320,
                  height: 160
                })
                : h(Box, {
                    bg: 'darken',
                    width: 320,
                    style: {
                      height: 160
                    }
                  })
            ),
          ),
          h(Box, { width: 1, px: 3 },
            h(Heading, { is: 'h3', mr: 3, fontSize: 3 }, 'npm'),
            h(InstallForm, {
              disabled: installing,
              name: 'packages',
              value: packages,
              onChange: this.handleChange,
              onSubmit: this.handleInstallSubmit
            }),
            pkg && h(Dependencies, this.props)
          )
        )
      )
    )
  }
}

module.exports = Project
