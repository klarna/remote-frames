import React, { Component } from 'react'
import { withContext } from 'recompose'
import equals from 'ramda/src/equals'

const setContextComponentsCache = []

const createSetContextComponent = (contextTypes = {}) => {
  const cachedSetContextComponents = setContextComponentsCache.filter(
    ([cachedContextTypes]) => equals(cachedContextTypes, contextTypes)
  )

  if (cachedSetContextComponents.length === 1) {
    return cachedSetContextComponents[0][1]
  }

  const SetContextComponent = withContext(contextTypes, props => ({
    ...props.context,
  }))(({ children }) => <div>{children}</div>)

  setContextComponentsCache.push([contextTypes, SetContextComponent])

  return SetContextComponent
}

class GlobalTarget extends Component {
  constructor() {
    super()

    this.stackTypes = []

    this.SetContextComponent = createSetContextComponent({})

    this.state = {
      stack: [],
    }
  }

  componentDidMount() {
    this.renderInRemote = ({ jsx, context, contextTypes }) => {
      this.SetContextComponent = createSetContextComponent(contextTypes)

      if (this.stackTypes.filter(type => type === jsx.type).length === 0) {
        this.stackTypes = [...this.stackTypes, jsx.type]

        this.setState(({ stack }) => ({
          context,
          stack: [...stack, jsx],
        }))

        this.props.onAddStackElement(jsx)
      } else {
        this.setState(({ stack }) => ({
          context,
          stack: stack.map(item => (item.type === jsx.type ? jsx : item)),
        }))
      }
    }

    this.removeFromRemote = jsx => {
      this.stackTypes = this.stackTypes.filter(type => type !== jsx.type)

      this.setState(
        ({ stack }) => ({
          stack: stack.filter(({ type }) => type !== jsx.type),
        }),
        () => {
          this.props.onRemoveStackElement(jsx)

          if (this.state.stack.length === 0) {
            this.props.onEmptyStack(jsx)
          }
        }
      )
    }

    this.props.onReady(this.renderInRemote, this.removeFromRemote)
  }

  render() {
    const { context, stack } = this.state

    return (
      <this.SetContextComponent context={context}>
        {stack.map((jsx, index) => {
          return (
            <div
              key={index}
              style={{ display: index === stack.length - 1 ? 'block' : 'none' }}
            >
              {jsx}
            </div>
          )
        })}
      </this.SetContextComponent>
    )
  }
}

GlobalTarget.defaultProps = {
  onAddStackElement: () => {},
  onEmptyStack: () => {},
  onRemoveStackElement: () => {}
}

export default GlobalTarget
