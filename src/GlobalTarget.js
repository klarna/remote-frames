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

    this.state = {
      stack: [],
    }
  }

  componentDidMount() {
    this.renderInRemote = ({ jsx, context, contextTypes, id }) => {
      const newStackItem = {
        jsx,
        SetContextComponent: createSetContextComponent(contextTypes),
        context,
        id
      };
      const stackTypes = this.state.stack.map(({jsx}) => jsx.type);
      if (stackTypes.filter(type => type === jsx.type).length === 0) {

        this.setState(({ stack }) => ({
          stack: [...stack, newStackItem],
        }))

        this.props.onAddStackElement(jsx)
      } else {
        this.setState(({ stack }) => ({
          stack: stack.map(item => (item.jsx.type === jsx.type ? newStackItem : item)),
        }))
      }
    }

    this.removeFromRemote = ({jsx, id}) => {
      this.setState(
        ({ stack }) => ({
          stack: stack.filter(item => item.id !== id),
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
    const { stack } = this.state

    return (
      <React.Fragment>
        {stack.map(({jsx, SetContextComponent, context}, index) => {
          return (
            <SetContextComponent key={index} context={context}>
              <div style={{ display: index === stack.length - 1 ? 'block' : 'none' }}>
                {jsx}
              </div>
            </SetContextComponent>
          )
        })}
      </React.Fragment>
    )
  }
}

GlobalTarget.defaultProps = {
  onAddStackElement: () => {},
  onEmptyStack: () => {},
  onRemoveStackElement: () => {}
}

export default GlobalTarget
