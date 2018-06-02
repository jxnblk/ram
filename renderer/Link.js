const React = require('react')
const h = React.createElement
const { setMode, openProject } = require('./updaters')
const { withContext } = require('./Context')

module.exports = withContext(props => h('a', Object.assign({}, props, {
  to: undefined,
  update: undefined,
  href: '#' + props.to,
  onClick: e => {
    e.preventDefault()
    let mode
    switch (props.to) {
      case '/':
        mode = 'index'
        break
      case 'new':
        mode = 'create'
        break
      default:
        mode = 'detail'
        props.update(openProject(props.to))
        return
        break
    }
    props.update(setMode(mode))
  }
})))
