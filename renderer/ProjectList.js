const React = require('react')
const {
} = require('rebass')
const { setMode } = require('./updaters')
const Link = require('./Link')

const h = React.createElement

const sortBy = order => (a, b) =>
  order.indexOf(a.dirname) - order.indexOf(b.dirname)

module.exports = ({
  projects = [],
  recents = [],
  update
}) => (
  h('div', null,
    h('h1', null, 'Projects'),
    h('ul', null,
      projects
        .sort(sortBy(recents))
        .map((project, i) => (
          h('li', {
            key: project.dirname + project.created
          },
            h(Link, {
              to: project.name
            },
              project.name + `(${project.created})`
            )
          )
        ))
    ),
    h('div', null,
      h(Link, { to: 'new' }, 'Create App')
    )
  )
)
