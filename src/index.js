import React, { Component } from 'react'
import { render } from 'react-dom'
import UnicornRemoteFrames from './UnicornRemoteFrames'

const Article = ({ red, green }) => (
  <article style={{ backgroundColor: red ? 'red' : green && 'green' }}>
    <h1>Hello World!</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur convallis ex nulla, sit
      amet lacinia tortor consequat ut. Aenean ut molestie nunc. Praesent porta purus vel eros
      finibus auctor. Phasellus felis massa, pulvinar vel tortor vel, luctus facilisis dui. Morbi
      congue justo massa, ac fermentum sapien auctor et. Vivamus eget consectetur turpis. Vivamus eu
      nunc sit amet leo dapibus consectetur. Duis aliquam egestas sapien, dictum vehicula risus
      elementum id.
    </p>
  </article>
)

const Section = props => (
  <section>
    <ul>
      <li>A</li>
      <li>B</li>
    </ul>
  </section>
)

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
      <div>
        {this.state.removeFirstOne || (
          <UnicornRemoteFrames>
            <Article red />
          </UnicornRemoteFrames>
        )}

        {this.state.initial || (
          <UnicornRemoteFrames>
            <Section green />
          </UnicornRemoteFrames>
        )}

        <button onClick={() => this.setState({ initial: !this.state.initial })}>Replace</button>
        <button onClick={() => this.setState({ removeFirstOne: !this.state.removeFirstOne })}>
          Replace
        </button>
      </div>
    )
  }
}

render(<Demo />, document.getElementById('root'))
