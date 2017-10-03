import { Component } from 'react'
import PropTypes from 'prop-types'

class UnicornRemoteFrame extends Component {
  componentDidMount() {
    this.context.renderInRemote(this.props.children)
  }

  componentWillReceiveProps(nextProps) {
    this.context.renderInRemote(nextProps.children)
  }

  componentWillUnmount() {
    this.context.removeFromRemote(this.props.children)
  }

  render() {
    return null
  }
}

UnicornRemoteFrame.contextTypes = {
  renderInRemote: PropTypes.func,
  removeFromRemote: PropTypes.func,
}

export default UnicornRemoteFrame
