const React = require('react')
const h = React.createElement
const Link = require('./Link')
const { removeProject } = require('./updaters')

class Project extends React.Component {
  render () {
    const {
      project,
      update
    } = this.props

    if (!project) return false
    const { name, dirname, created } = project

    return h('div', null,
      h(Link, { to: '/', }, 'Back'),
      h('h1', null, name),
      h('pre', null, `${dirname} (${created})`),
      h('button', {
        onClick: e => {
          update(removeProject(name))
        }
      }, 'remove')
    )
  }
}

module.exports = Project
