import React from 'react'
import { render } from 'react-dom'
import UnicornRemoteFrame from '../UnicornRemoteFrame'

render(
  <div>
    <UnicornRemoteFrame>
      <p>Hello inline</p>
    </UnicornRemoteFrame>
  </div>,
  document.getElementById('root')
)
