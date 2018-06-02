const React = require('react')
const { render } = require('react-dom')
const App = require('./App')
const store = require('./store')

const [ dirname ] = store.store.recents

render(
  React.createElement(App, store.store),
  document.getElementById('root')
)
