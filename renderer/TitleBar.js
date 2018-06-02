const React = require('react')
const {
  Flex,
  Box,
  Text
} = require('rebass')
const styled = require('styled-components').default

const h = React.createElement

const Root = styled(Flex)([], {
  WebkitAppRegion: 'drag',
  appRegion: 'drag',
  height: '40px',
})

module.exports = ({
  dirname
}) => (
  h(Root, {
    alignItems: 'center',
  },
    h(Box, { width: 128 }),
    h(Text, {
      mx: 'auto',
      fontSize: 0
    }, dirname),
    h(Box, { width: 128 }),
  )
)
