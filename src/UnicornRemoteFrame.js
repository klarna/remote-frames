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
      const { renderInRemote } = this.context
      const { children } = this.props

      doRemoteRender(
        renderInRemote,
        this.context,
        { renderInRemote: PropTypes.func, ...contextTypes },
        children
      )
    }

    shouldComponentUpdate(nextProps) {
      return !equals(this.props.children, nextProps.children)
    }

    componentDidUpdate() {
      const { renderInRemote } = this.context
      const { children } = this.props

      doRemoteRender(
        renderInRemote,
        this.context,
        { renderInRemote: PropTypes.func, ...contextTypes },
        children
      )
    }

    render() {
      return null
    }
  }

  CapturedContextComponent.contextTypes = {
    renderInRemote: PropTypes.func,
    ...contextTypes,
  }

  CapturedContextComponent.childContextTypes = {
    renderInRemote: PropTypes.func,
    ...contextTypes,
  }

  capturedContextComponentsCache.push([contextTypes, CapturedContextComponent])

  return CapturedContextComponent
}

class RemoteFrame extends Component {
  constructor(props, context) {
    super(props, context)

    if (context.removeFromRemote != null) {
      this.CapturedContextComponent = createCapturedContextComponent({
        ...context.remoteFrameContextTypes,
        ...props.contextTypes,
        ...RemoteFrame.contextTypes,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.context.removeFromRemote != null) {
      this.CapturedContextComponent = createCapturedContextComponent({
        ...this.context.remoteFrameContextTypes,
        ...nextProps.contextTypes,
        ...RemoteFrame.contextTypes,
      })
    }
  }

  componentWillUnmount() {
    if (this.context.removeFromRemote != null) {
      this.context.removeFromRemote(this.props.children)
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
  removeFromRemote: PropTypes.func,
  remoteFrameContextTypes: PropTypes.object,
}

export default RemoteFrame
