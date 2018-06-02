const React = require('react')
const {
  Flex,
  Box,
  Text
} = require('rebass')
const styled = require('styled-components').default
const { modes } = require('./constants')

const h = React.createElement

const Root = styled(Flex)([], {
  WebkitAppRegion: 'drag',
  appRegion: 'drag',
  height: '40px',
})

const getTitle = ({
  project,
  mode
}) => {
  if (project && project.name) return project.name
  switch (mode) {
    case modes.create:
      return 'Create React App'
    case modes.index:
    default:
      return 'Projects'
  }
}

module.exports = ({
  mode,
  project,
  dirname
}) => (
  h(Root, {
    alignItems: 'center',
  },
    h(Box, { width: 128 }),
    h(Text, {
      mx: 'auto',
      fontSize: 0
    }, getTitle({ mode, project })),
    h(Box, { width: 128 }),
  )
)
