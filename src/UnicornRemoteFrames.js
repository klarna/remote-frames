import React, { Component } from 'react'
import { find } from 'ramda'
import { render } from 'react-dom'

let renderInRemote = () => {}
let removeFromRemove = () => {}

class RemoteFrames extends Component {
  constructor() {
    super()
    this.state = {
      stack: [<p>Placeholder</p>],
    }

    renderInRemote = jsx => {
      const alreadyHere = find(({ type }) => type === jsx.type, this.state.stack)
      this.setState({ toRender: jsx })

      if (alreadyHere == null) {
        this.setState(({ stack }) => ({
          stack: [...stack, jsx],
        }))
      }
    }

    removeFromRemove = jsx => {
      this.setState(({ stack }) => ({
        stack: stack.filter(({ type }) => type !== jsx.type),
      }))
    }
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  render() {
    return this.state.stack.map((jsx, index) => <div key={index} style={{display: index === this.state.stack.length - 1 ? 'block' : 'none'}}>
      {jsx}
    </div>)
  }
}

const targetDomElement = document.createElement('div')
targetDomElement.setAttribute('id', 'unicorn-remote-frames-target-dom-element')

window.parent.frames['target'].document.body.appendChild(targetDomElement)

render(<RemoteFrames />, targetDomElement)

class UnicornRemoteFrame extends Component {
  constructor(props) {
    super(props)

    renderInRemote(props.children)
  }

  componentWillReceiveProps(nextProps) {
    renderInRemote(nextProps.children)
  }

  componentWillUnmount() {
    removeFromRemove(this.props.children)
  }

  render() {
    return false
  }
}

export default UnicornRemoteFrame
