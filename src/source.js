import React, { Component } from 'react'
import { render } from 'react-dom'
import UnicornRemoteFramesProvider from './UnicornRemoteFramesProvider'
import UnicornRemoteFrame from './UnicornRemoteFrame'

class Article extends Component {
  constructor(props) {
    super(props)

    this.state = {
      likes: 2,
    }
  }

  render() {
    const { red, green } = this.props
    const { likes } = this.state

    return (
      <article style={{ backgroundColor: red ? 'red' : green && 'green' }}>
        <h1>Hello World!</h1>
        <strong>{likes} people like this article</strong>
        <button onClick={() => this.setState(({ likes }) => ({ likes: likes + 1 }))}>Like</button>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur convallis ex nulla, sit
          amet lacinia tortor consequat ut. Aenean ut molestie nunc. Praesent porta purus vel eros
          finibus auctor. Phasellus felis massa, pulvinar vel tortor vel, luctus facilisis dui.
          Morbi congue justo massa, ac fermentum sapien auctor et. Vivamus eget consectetur turpis.
          Vivamus eu nunc sit amet leo dapibus consectetur. Duis aliquam egestas sapien, dictum
          vehicula risus elementum id.
        </p>
      </article>
    )
  }
}

const Section = props => (
  <section>
    <ul>
      <li>A</li>
      <li>B</li>
    </ul>
  </section>
)

const targetDomElement = document.createElement('div')
targetDomElement.setAttribute('id', 'remote-root')
window.parent.frames['target'].document.body.appendChild(targetDomElement)

class Demo extends Component {
  constructor() {
    super()

    this.state = {
      initial: true,
      removeFirstOne: false,
    }
  }

  render() {
    return (
      <UnicornRemoteFramesProvider
        targetDomElement={targetDomElement}
        onFrameAdded={jsx => console.log('onFrameAdded', jsx)}
        onNoFrames={jsx => console.log('onNoFrames', jsx)}
      >
        <div>
          {this.state.removeFirstOne || (
            <UnicornRemoteFrame>
              <Article red />
            </UnicornRemoteFrame>
          )}

          {this.state.initial || (
            <UnicornRemoteFrame>
              <Section green />
            </UnicornRemoteFrame>
          )}

          <button onClick={() => this.setState({ initial: !this.state.initial })}>Replace</button>
          <button onClick={() => this.setState({ removeFirstOne: !this.state.removeFirstOne })}>
            Replace
          </button>
        </div>
      </UnicornRemoteFramesProvider>
    )
  }
}

render(<Demo />, document.getElementById('root'))
