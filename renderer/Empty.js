const h = require('react').createElement
const {
  Box,
  Heading,
  Text,
} = require('rebass')

module.exports = () => (
  h(Box, {
    w: 1,
    px: 3,
    py: 6,
    color: 'gray'
  },
    h(Heading, {
      textAlign: 'center',
      fontSize: 3,
      mb: 3
    }, 'No Projects Found'),
    h(Text, {
      textAlign: 'center',
    }, 'Create a new React app or open and existing project')
  )
)
