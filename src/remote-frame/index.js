import React, { Component } from 'react'
import PropTypes from 'prop-types'
import equals from 'ramda/src/equals'

const capturedContextComponentsCache = []

const doRemoteRender = (renderInRemote, context, contextTypes, children) => {
  renderInRemote({
    jsx: children,
    context: Object.keys(contextTypes).reduce(
      (contextSoFar, key) => ({
        ...contextSoFar,
        [key]: context[key],
      }),
      {}
    ),
    contextTypes,
  })
}

const createCapturedContextComponent = (contextTypes = {}) => {
  const cachedCapturedContextComponents = capturedContextComponentsCache.filter(
    ([cachedContextTypes]) => equals(cachedContextTypes, contextTypes)
  )

  if (cachedCapturedContextComponents.length === 1) {
    return cachedCapturedContextComponents[0][1]
  }

  class CapturedContextComponent extends Component {
    componentDidMount() {
      const { renderInRemote } = this.context.callBackContainer
      const { children } = this.props

      doRemoteRender(
        renderInRemote,
        this.context,
        { callBackContainer: PropTypes.object, ...contextTypes },
        children
      )
    }

    shouldComponentUpdate(nextProps) {
      return !equals(this.props.children, nextProps.children)
    }

    componentDidUpdate() {
      const { renderInRemote } = this.context.callBackContainer
      const { children } = this.props

      doRemoteRender(
        renderInRemote,
        this.context,
        { callBackContainer: PropTypes.object, ...contextTypes },
        children
      )
    }

    render() {
      return null
    }
  }

  CapturedContextComponent.contextTypes = {
    callBackContainer: PropTypes.object,
    ...contextTypes,
  }

  CapturedContextComponent.childContextTypes = {
    callBackContainer: PropTypes.object,
    ...contextTypes,
  }

  capturedContextComponentsCache.push([contextTypes, CapturedContextComponent])

  return CapturedContextComponent
}

class RemoteFrame extends Component {
  constructor(props, context) {
    super(props, context)

    if (context.callBackContainer != null) {
      this.CapturedContextComponent = createCapturedContextComponent({
        ...context.remoteFrameContextTypes,
        ...props.contextTypes,
        ...RemoteFrame.contextTypes,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.context.callBackContainer != null) {
      this.context.callBackContainer.subscribe(() => this.forceUpdate())
      this.CapturedContextComponent = createCapturedContextComponent({
        ...this.context.remoteFrameContextTypes,
        ...nextProps.contextTypes,
        ...RemoteFrame.contextTypes,
      })
    }
  }

  componentWillUnmount() {
    if (this.context.callBackContainer != null) {
      this.context.callBackContainer.removeFromRemote(this.props.children)
    }
  }

  render() {
    if (this.CapturedContextComponent != null) {
      return <this.CapturedContextComponent {...this.props} />
    } else {
      return this.props.children
    }
  }
}

RemoteFrame.contextTypes = {
  callBackContainer: PropTypes.object,
  remoteFrameContextTypes: PropTypes.object,
}

export default RemoteFrame
