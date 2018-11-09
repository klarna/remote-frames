import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import GlobalTarget from './GlobalTarget'

class RemoteFramesProvider extends Component {
  constructor(props) {
    super(props)

    this.queue = []

    this.state = {
      renderInRemote: renderInformation => {
        if (this.queue == null) {
          throw new Error(
            'The queue in the RemoteFramesProvider was flushed, yet the RemoteFrame is trying to use the `renderInRemote` that will add to the queue. This means the RemoteFrame did not pick up the React.context update: check the elements in between, if they are intercepting the context in some way.'
          )
        }
        this.queue.push(['render', renderInformation])
      },
      removeFromRemote: jsx => {
        if (this.queue == null) {
          throw new Error(
            'The queue in the RemoteFramesProvider was flushed, yet the RemoteFrame is trying to use the `removeFromRemote` that will add to the queue. This means the RemoteFrame did not pick up the React.context update: check the elements in between, if they are intercepting the context in some way.'
          )
        }
        this.queue.push(['remove', jsx])
      },
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.targetDomElement !== prevProps.targetDomElement) {
      if (this.props.targetDomElement instanceof HTMLElement) {
        this.renderGlobalTarget(this.props.targetDomElement)
      } else {
        this.props.targetDomElement.then(this.renderGlobalTarget.bind(this))
      }
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
        this.queue.forEach(([type, renderInformation]) => {
          if (type === 'render') {
            renderInRemote(renderInformation)
          } else {
            removeFromRemote(renderInformation)
          }
        })
      }
    )
  }

  getChildContext() {
    return {
      renderInRemote: this.state.renderInRemote,
      removeFromRemote: this.state.removeFromRemote,
      remoteFrameContextTypes: this.props.contextTypes,
    }
  }

  render() {
    return this.props.children
  }
}

RemoteFramesProvider.childContextTypes = {
  renderInRemote: PropTypes.func,
  removeFromRemote: PropTypes.func,
  remoteFrameContextTypes: PropTypes.object,
}

export default RemoteFramesProvider
