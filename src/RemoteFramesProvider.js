import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {render, unmountComponentAtNode} from 'react-dom'
import GlobalTarget from './GlobalTarget'

// We need this in order to not relay on the consumer to make sure that the context is updated
// With this pattern we need just to be sure the context is set at the first time, then we take care of updating it.
// The consumer should take care of propagating its own context
class CallbackContainer {
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
    this.callBackContainer = new CallbackContainer(
      renderInformation => {
        if (this.queue == null) {
          throw new Error(
            'The queue in the RemoteFramesProvider was flushed, yet the RemoteFrame is trying to use the `renderInRemote` that will add to the queue. This means the RemoteFrame did not pick up the React.context update: check the elements in between, if they are intercepting the context in some way.'
          )
        }
        this.queue.push(['render', renderInformation])
      }, renderInformation => {
        if (this.queue == null) {
          throw new Error(
            'The queue in the RemoteFramesProvider was flushed, yet the RemoteFrame is trying to use the `removeFromRemote` that will add to the queue. This means the RemoteFrame did not pick up the React.context update: check the elements in between, if they are intercepting the context in some way.'
          )
        }
        this.queue.push(['remove', renderInformation])
      }
    )
    this.queue = []
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.targetDomElement !== prevProps.targetDomElement ||
      this.props.wrapperComponent !== prevProps.wrapperComponent ||
      this.props.wrapperComponentProps !== prevProps.wrapperComponentProps
    ) {
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
    unmountComponentAtNode(targetDomElement)

    const target = (
      <GlobalTarget
        onAddStackElement={this.props.onFrameAdded}
        onEmptyStack={this.props.onNoFrames}
        onRemoveStackElement={this.props.onFrameRemoved}
        onReady={this.handleOnReady.bind(this)}
      />
    )

    const WrapperComponent = this.props.wrapperComponent
    const wrapperComponentProps = this.props.wrapperComponentProps

    if (WrapperComponent) {
      render(
        <WrapperComponent {...wrapperComponentProps}>
          {target}
        </WrapperComponent>,
        targetDomElement
      )
    } else {
      render(
        target,
        targetDomElement
      )
    }
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
