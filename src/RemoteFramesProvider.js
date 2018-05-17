import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {render} from 'react-dom'
import GlobalTarget from './GlobalTarget'

class CallBackContainer {
  constructor(renderInRemote, removeFromRemote) {
    this.renderInRemote = renderInRemote
    this.removeFromRemote = removeFromRemote
    this.subscriptions = []
  }

  setRenderFn(renderInRemote, removeFromRemote) {
    this.renderInRemote = renderInRemote
    this.removeFromRemote = removeFromRemote
    this.subscriptions.forEach(f => f())
  }

  subscribe(f) {
    this.subscriptions.push(f)
  }
}

class RemoteFramesProvider extends Component {
  constructor(props) {
    super(props)
    this.callBackContainer = new CallBackContainer(
      renderInformation => {
        if (this.queue == null) {
          throw new Error(
            'The queue in the RemoteFramesProvider was flushed, yet the RemoteFrame is trying to use the `renderInRemote` that will add to the queue. This means the RemoteFrame did not pick up the React.context update: check the elements in between, if they are intercepting the context in some way.'
          )
        }
        this.queue.push(['render', renderInformation])
      }, jsx => {
        if (this.queue == null) {
          throw new Error(
            'The queue in the RemoteFramesProvider was flushed, yet the RemoteFrame is trying to use the `removeFromRemote` that will add to the queue. This means the RemoteFrame did not pick up the React.context update: check the elements in between, if they are intercepting the context in some way.'
          )
        }
        this.queue.push(['remove', jsx])
      }
    )
    this.queue = []
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
    this.callBackContainer.setRenderFn(renderInRemote, removeFromRemote)
    this.queue.forEach(([type, renderInformation]) => {
      if (type === 'render') {
        renderInRemote(renderInformation)
      } else {
        removeFromRemote(renderInformation)
      }
    })

    delete this.queue
  }

  getChildContext() {
    return {
      callBackContainer: this.callBackContainer,
      remoteFrameContextTypes: this.props.contextTypes
    }
  }

  render() {
    return this.props.children
  }
}

RemoteFramesProvider.childContextTypes = {
  callBackContainer: PropTypes.object,
  remoteFrameContextTypes: PropTypes.object
}

export default RemoteFramesProvider
