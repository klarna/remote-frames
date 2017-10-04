import React, { Component } from 'react'
import { render } from 'react-dom'
import { withContext } from 'recompose'
import PropTypes from 'prop-types'
import UnicornRemoteFramesProvider from '../UnicornRemoteFramesProvider'
import UnicornRemoteFrame from '../UnicornRemoteFrame'
import FakeArticle from './FakeArticle'
import Section from './Section'

const targetDomElement = document.createElement('div')
targetDomElement.setAttribute('id', 'remote-root')
window.parent.frames['target'].document.body.appendChild(targetDomElement)

const Wrapper = withContext(
  {
    theme: PropTypes.object,
    values: PropTypes.array,
  },
  () => ({
    theme: {
      borderColor: 'black',
      backgroundColor: 'red',
    },
    values: ['yes', 'from', 'context'],
  })
)(props => <div {...props} />)

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
        contextTypes={{
          values: PropTypes.array,
        }}
        targetDomElement={
          new Promise(resolve => {
            setTimeout(() => resolve(targetDomElement), 1000)
          })
        }
        onFrameAdded={jsx => console.log('onFrameAdded', jsx)}
        onNoFrames={jsx => console.log('onNoFrames', jsx)}
      >
        <Wrapper>
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
        </Wrapper>
      </UnicornRemoteFramesProvider>
    )
  }
}

render(<Demo />, document.getElementById('root'))
