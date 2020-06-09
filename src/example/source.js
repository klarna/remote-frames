import React, { Component } from 'react'
import { render } from 'react-dom'
import { withContext } from 'recompose'
import PropTypes from 'prop-types'
import RemoteFramesProvider from '../RemoteFramesProvider'
import RemoteFrame from '../remote-frame'
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
      <RemoteFramesProvider
        contextTypes={{
          theme: PropTypes.object,
          values: PropTypes.array,
        }}
        targetDomElement={
          new Promise(resolve => {
            setTimeout(() => resolve(targetDomElement), 1000)
          })
        }
        onFrameAdded={jsx => console.log('onFrameAdded', jsx)}
        onNoFrames={jsx => console.log('onNoFrames', jsx)}
        onFrameRemoved={jsx => console.log('onFrameRemoved', jsx)}
      >
        <Wrapper>
          {this.state.initial || (
            <RemoteFrame id="Top level section">
              <Section green />
            </RemoteFrame>
          )}
          {this.state.removeFirstOne || <FakeArticle red />}

          <button onClick={() => this.setState({ initial: !this.state.initial })}>List</button>

          <button onClick={() => this.setState({ removeFirstOne: !this.state.removeFirstOne })}>
            Article
          </button>
        </Wrapper>
      </RemoteFramesProvider>
    )
  }
}

render(<Demo />, document.getElementById('root'))
