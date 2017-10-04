import React, { Component } from 'react'
import { render } from 'react-dom'
import UnicornRemoteFramesProvider from '../UnicornRemoteFramesProvider'
import UnicornRemoteFrame from '../UnicornRemoteFrame'
import FakeArticle from './FakeArticle'

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
        targetDomElement={
          new Promise(resolve => {
            setTimeout(() => resolve(targetDomElement), 1000)
          })
        }
        onFrameAdded={jsx => console.log('onFrameAdded', jsx)}
        onNoFrames={jsx => console.log('onNoFrames', jsx)}
      >
        <div>
          {this.state.removeFirstOne || <FakeArticle red />}
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
