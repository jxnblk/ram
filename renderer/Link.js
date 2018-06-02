const React = require('react')
const h = React.createElement
const { setMode, openProject } = require('./updaters')
const { withContext } = require('./Context')

module.exports = withContext(({
  update,
  to,
  id,
  className,
  style,
  children,
}) => h('a', {
  id,
  className,
  style,
  children,
  href: '#' + to,
  onClick: e => {
    e.preventDefault()
    let mode
    switch (to) {
      case '/':
        mode = 'index'
        break
      case 'new':
        mode = 'create'
        break
      default:
        mode = 'detail'
        update(openProject(to))
        return
        break
    }
    update(setMode(mode))
  }
}))
