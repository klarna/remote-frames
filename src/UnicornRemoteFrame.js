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

      doRemoteRender(renderInRemote, this.context, contextTypes, children)
    }

    componentWillReceiveProps(nextProps) {
      const { renderInRemote } = this.context
      const { children } = nextProps

      doRemoteRender(renderInRemote, this.context, contextTypes, children)
    }

    render() {
      return null
    }
  }

  CapturedContextComponent.contextTypes = {
    renderInRemote: PropTypes.func,
    ...contextTypes,
  }

  capturedContextComponentsCache.push([contextTypes, CapturedContextComponent])

  return CapturedContextComponent
}

class UnicornRemoteFrame extends Component {
  constructor(props, context) {
    super(props, context)

    this.CapturedContextComponent = createCapturedContextComponent({
      ...context.unicornContextTypes,
      ...props.contextTypes,
    })
  }

  componentWillReceiveProps(nextProps) {
    this.CapturedContextComponent = createCapturedContextComponent({
      ...this.context.unicornContextTypes,
      ...nextProps.contextTypes,
    })
  }

  componentWillUnmount() {
    this.context.removeFromRemote(this.props.children)
  }

  render() {
    return <this.CapturedContextComponent {...this.props} />
  }
}

UnicornRemoteFrame.contextTypes = {
  removeFromRemote: PropTypes.func,
  unicornContextTypes: PropTypes.object,
}

export default UnicornRemoteFrame
