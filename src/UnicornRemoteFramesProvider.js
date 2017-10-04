import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import GlobalTarget from './GlobalTarget'

class UnicornRemoteFramesProvider extends Component {
  constructor(props) {
    super(props)

    // Queue calls and flush when available
    this.queue = []

    this.state = {
      renderInRemote: jsx => this.queue.push(['render', jsx]),
      removeFromRemote: jsx => this.queue.push(['remove', jsx]),
    }
  }

  componentDidMount() {
    if (this.props.targetDomElement instanceof HTMLElement) {
      this.renderGlobalTarget(this.props.targetDomElement)
    } else {
      this.props.targetDomElement.then(this.renderGlobalTarget.bind(this))
    }
  }

  renderGlobalTarget(targetDomElement) {
    render(
      <GlobalTarget
        onAddStackElement={this.props.onFrameAdded}
        onEmptyStack={this.props.onNoFrames}
        onReady={this.handleOnReady.bind(this)}
      />,
      targetDomElement
    )
  }

  handleOnReady(renderInRemote, removeFromRemote) {
    this.setState(
      {
        renderInRemote,
        removeFromRemote,
      },
      () => {
        this.queue.forEach(([type, jsx]) => {
          if (type === 'render') {
            renderInRemote(jsx)
          } else {
            removeFromRemote(jsx)
          }
        })

        delete this.queue
      }
    )
  }

  getChildContext() {
    return {
      renderInRemote: this.state.renderInRemote,
      removeFromRemote: this.state.removeFromRemote,
    }
  }

  render() {
    return this.props.children
  }
}

UnicornRemoteFramesProvider.childContextTypes = {
  renderInRemote: PropTypes.func,
  removeFromRemote: PropTypes.func,
}

export default UnicornRemoteFramesProvider
