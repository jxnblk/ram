const React = require('react')
const h = React.createElement
const styled = require('styled-components').default
const { minHeight } = require('styled-system')
const {
  Box,
  Heading,
  Text,
  Pre,
} = require('rebass')

const toArray = obj => Object.keys(obj).map(key => ({
  name: key,
  version: obj[key]
}))

const Root = styled(Box)([], {
  overflow: 'auto'
}, minHeight)

module.exports = ({
  pkg = {}
}) => {
  const deps = toArray(pkg.dependencies || {})
  const dev = toArray(pkg.devDependencies || {})

  return h(Root, {
    minHeight: 256
  },
    h(Heading, { is: 'h3', fontSize: 2, mb: 2 }, 'npm'),
    h(Heading, { is: 'h4', fontSize: 0, mb: 2, color: 'gray' }, 'Dependencies'),
    deps.map(({ name, version }) => h(Pre, { fontSize: 0 },
      name,
      h(Text, { is: 'span', color: 'gray' },
        '@', version
      )
    )),
    h(Heading, { is: 'h4', fontSize: 0, mt: 2, mb: 2, color: 'gray' }, 'Development dependencies'),
    dev.map(({ name, version }) => h(Pre, { fontSize: 0 },
      name,
      h(Text, { is: 'span', color: 'gray' },
        '@', version
      )
    ))
  )
}
