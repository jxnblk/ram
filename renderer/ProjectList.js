const React = require('react')
const {
  Box,
  Flex,
  Card,
  Text,
  Heading,
  BlockLink,
  Button,
  Image,
} = require('rebass')
const { setMode } = require('./updaters')
const Link = require('./Link')
const Empty = require('./Empty')

const h = React.createElement

const sortBy = order => (a, b) =>
  order.indexOf(a.dirname) - order.indexOf(b.dirname)

module.exports = ({
  projects = [],
  recents = [],
  update
}) => (
  h(Box, {
    px: 3,
    py: 4,
  },
    h(Flex, {
      alignItems: 'center',
    },
      h(Heading, {
        is: 'h1',
        fontSize: 6,
      }, 'Projects'),
      h(Box, { mx: 'auto' }),
      h(Button, {
        is: Link,
        to: 'new',
        color: 'black',
        bg: 'cyan'
      }, 'Create App')
    ),
    h(Flex, {
      mx: -3,
      flexWrap: 'wrap',
    },
      !projects.length && h(Empty),
      projects
        .sort(sortBy(recents))
        .map((project, i) => (
          h(Box, {
            key: project.dirname,
            width: [ 1/2, null, null, 1/3, 1/4 ],
            p: 3,
          },
            h(BlockLink, {
              is: Link,
              to: project.name
            },
              project.thumbnail ? (
                h(Image, {
                  width: 1,
                  height: 160,
                  src: project.thumbnail
                })
              ) : (
                h(Box, {
                  width: 320,
                  bg: 'gray',
                  style: {
                    maxWidth: '100%',
                    height: 160
                  }
                })
              ),
              h(Text, { fontSize: 0, mt: 2 },
                project.name
              ),
            )
          )
        ))
    )
  )
)
