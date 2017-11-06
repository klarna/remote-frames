# @klarna/unicorn-remote-frames

Render a subset of the React tree to a different location, from many locations, without having to coordinate them.

## Usage

Say that you have an HTML with two DOM nodes that you want to render to:

```html
<!doctype html>
<html>
  <head>
    <title>Unicorns</title>
  </head>
  <body>
    <div id="dialogs-node"></div>
    <div id="main-content-node"></div>
  </body>
</html>
```

…and for some reason, you want elements in the React tree rendered under the `"main-content-node"` to be able to inject elements into the `"dialogs-node"`. The `UnicornRemoteFrame` allows you to send this elements to the remote tree (the one under `"dialogs-node"`).

```js
import React, { Component } from 'react'
import {
  UnicornRemoteFrame,
  UnicornRemoteFramesProvider
} from '@klarna/unicorn-remote-frames'

const Dialog1 = () => <article>
  <h2>Lorem ipsum</h2>
</article>

const Dialog2 = () => <section>
  <h3>Dolor sit amet</h3>
</section>

class App extends Component {
  constructor() {
    super()

    this.state = {
      showDialog1: false,
      showDialog2: false,
    }
  }

  render() {
    const { showDialog1, showDialog2 } = this.state

    return <UnicornRemoteFramesProvider
      targetDomElement={Promise.resolve(
        document.getElementById('dialogs-node')
      )}
      onFrameAdded={frameJSX => {
        console.log(
          'a new frame was added to the dialogs-node stack',
          frameJSX
        )
      }}
      onEmptyStack={lastJSXRemoved => {
        console.log(
          'all frames have been removed from the stack',
          lastJSXRemoved
        )
      }}>
      <div>
        <h1>App that demonstrates unicorn-remote-frames</h1>
        <button
          onClick={() => this.setState({
            showDialog1: !showDialog1
          })}>
          {showDialog1 ? 'Hide Dialog 1' : 'Show Dialog 1'}
        </button>

        <button
          onClick={() => this.setState({
            showDialog2: !showDialog1
          })}>
          {showDialog2 ? 'Hide Dialog 2' : 'Show Dialog 2'}
        </button>

        {showDialog1 && <UnicornRemoteFrame>
          <Dialog1 />
        </UnicornRemoteFrame>}

        {showDialog2 && <UnicornRemoteFrame>
          <Dialog2 />
        </UnicornRemoteFrame>}
      </div>
    </UnicornRemoteFramesProvider>
  }
}

render(
  <App />,
  document.getElementById('main-content-node')
)
```

Whenever you click the "Show" / "Hide" buttons, the dialogs are sent to a React tree under the `"dialogs-node"`, and rendered one at a time. If there was no dialog being shown at the time, then the new dialog is added; if there was a dialog shown already, the new dialog is shown instead, but then if the new dialog is removed, the old dialog is shown again, as in a sort of stack.

State of the elements inside the `UnicornRemoteFrame` is preserved, even when unmounted.

### Missing UnicornRemoteFramesProvider

If there is no `UnicornRemoteFramesProvider` in the tree before the `UnicornRemoteFrame`, the content of `UnicornRemoteFrame` will just be rendered in place.

### Context

For the React.context to be propagated to the new tree, you have to manually specify what props of the context you want to propagate:

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getContext, withContext } from 'recompose'
import {
  UnicornRemoteFrame,
  UnicornRemoteFramesProvider
} from '@klarna/unicorn-remote-frames'

const Dialog1 = getContext({ content1: PropTypes.string })(({content1}) => <article>
  <h2>{content1}</h2>
</article>)

const Dialog2 = getContext({ content2: PropTypes.string })(({content2}) => <section>
  <h3>{content2}</h3>
</section>)


const App = withContext(
  {
    content1: PropTypes.string,
    content2: PropTypes.string,
  },
  () => ({
    content1: 'Hello Dialog 1',
    content2: 'Hello Dialog 2',
  })
)(() => {
  return <UnicornRemoteFramesProvider
    contextTypes={{
      content1: PropTypes.string,
    }}
    targetDomElement={Promise.resolve(
      document.getElementById('dialogs-node')
    )}>
    <div>
      <h1>App that demonstrates unicorn-remote-frames</h1>
      <button
        onClick={() => this.setState({
          showDialog1: !showDialog1
        })}>
        {showDialog1 ? 'Hide Dialog 1' : 'Show Dialog 1'}
      </button>

      <button
        onClick={() => this.setState({
          showDialog2: !showDialog1
        })}>
        {showDialog2 ? 'Hide Dialog 2' : 'Show Dialog 2'}
      </button>

      <UnicornRemoteFrame>
        <Dialog1 />
      </UnicornRemoteFrame>

      <UnicornRemoteFrame
        contextTypes={{
          content2: PropTypes.string,
        }}>
        <Dialog2 />
      </UnicornRemoteFrame>
    </div>
  </UnicornRemoteFramesProvider>
})

render(
  <App />,
  document.getElementById('main-content-node')
)
```

### Callbacks on `UnicornRemoteFramesProvider`

Two callbacks are available on `UnicornRemoteFramesProvider`:

- `onFrameAdded`: gets call whenever another frame is added to the stack
- `onEmptyStack`: gets call whenever all frames are removed from the stack

### Passing the `targetDomElement`

The `targetDomElement` used to render the new React tree can be passed directly to the `UnicornRemoteFramesProvider` as a prop, or it can be passed as a Promise, allowing you to wait until the targetDomElement is available (for example if it is rendered in another window).

Frames stacked before the `targetDomElement` is available will be queued, so you will not lose any information.
