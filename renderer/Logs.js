const React = require('react')
const {
  Box,
  Pre,
} = require('rebass')
const styled = require('styled-components').default
const { height } = require('styled-system')

const { createElement: h } = React

const Root = styled(Box)([], {
  overflowY: 'auto',
}, height)

Root.defaultProps = {
  p: 2,
  bg: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  height: '256px'
}

module.exports = class extends React.Component {
  componentDidUpdate (prev) {
    if (prev.logs.length === this.props.logs.length) return
    if (!this.root) return
    this.root.scrollTop = this.root.scrollHeight
  }

  render () {
    const {
      logs = [],
      height
    } = this.props

    return h(Root, {
      height,
      innerRef: ref => this.root = ref
    },
      h(Pre, { color: '#666' }, 'Logs'),
      h(Pre, { color: 'cyan' },
        logs.map((msg, i) => h('span', { key: i + msg }, msg))
      )
    )
  }
}
