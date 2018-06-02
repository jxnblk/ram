const React = require('react')
const h = React.createElement

const Context = React.createContext(null)

Context.withContext = Component => props =>
  h(Context.Consumer, null, ctx =>
    h(Component, Object.assign({}, props, ctx))
  )

module.exports = Context
