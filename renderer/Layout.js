const React = require('react')
const h = React.createElement
const {
  Flex,
  Box,
} = require('rebass')
const Logs = require('./Logs')

module.exports = props => {
  return h(Flex, {
    flexDirection: 'column',
    style: {
      height: 'calc(100vh - 40px)'
    }
  },
    h(Box, { width: 1, flex: '1 1 auto',
      style: {
        overflow: 'auto'
      }
    },
      props.children
    ),
    h(Box, { width: 1, flex: 'none' },
      h(Logs, props)
    )
  )
}
