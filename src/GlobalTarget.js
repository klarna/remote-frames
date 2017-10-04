import React, { Component } from 'react'

class GlobalTarget extends Component {
  constructor() {
    super()

    this.stackTypes = []

    this.state = {
      stack: [],
    }
  }

  componentDidMount() {
    this.renderInRemote = jsx => {
      if (this.stackTypes.filter(type => type === jsx.type).length === 0) {
        this.stackTypes = [...this.stackTypes, jsx.type]

        this.setState(({ stack }) => ({
          stack: [...stack, jsx],
        }))

        this.props.onAddStackElement(jsx)
      } else {
        this.setState(({ stack }) => ({
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
          if (this.state.stack.length === 0) {
            this.props.onEmptyStack(jsx)
          }
        }
      )
    }

    this.props.onReady(this.renderInRemote, this.removeFromRemote)
  }

  render() {
    return (
      <div>
        {this.state.stack.map((jsx, index) => (
          <div
            key={index}
            style={{ display: index === this.state.stack.length - 1 ? 'block' : 'none' }}
          >
            {jsx}
          </div>
        ))}
      </div>
    )
  }
}

GlobalTarget.defaultProps = {
  onAddStackElement: () => {},
  onEmptyStack: () => {},
}

export default GlobalTarget
