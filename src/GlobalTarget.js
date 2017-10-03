import React, { Component } from 'react'
import { find } from 'ramda'

class GlobalTarget extends Component {
  constructor() {
    super()

    this.stackTypes = []

    this.state = {
      stack: [],
    }

    this.renderInRemote = jsx => {
      const alreadyHere = find(type => type === jsx.type, this.stackTypes)

      if (alreadyHere == null) {
        this.stackTypes = [...this.stackTypes, jsx.type]

        this.setState(({ stack }) => ({
          stack: [...stack, jsx],
        }))

        this.props.onAddStackElement(jsx)
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
  }

  componentDidMount() {
    this.props.onReady(this.renderInRemote, this.removeFromRemote)
  }

  componentDidUpdate() {
    console.log('CURRENT STACK', this.state.stack)
  }

  render() {
    return this.state.stack.map((jsx, index) => (
      <div
        key={index}
        style={{ display: index === this.state.stack.length - 1 ? 'block' : 'none' }}
      >
        {jsx}
      </div>
    ))
  }
}

GlobalTarget.defaultProps = {
  onAddStackElement: () => {},
  onEmptyStack: () => {},
}

export default GlobalTarget
