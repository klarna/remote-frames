import React from 'react'
import { render } from 'react-dom'
import RemoteFrame from '../RemoteFrame'

render(
  <div>
    <RemoteFrame>
      <p>Hello inline</p>
    </RemoteFrame>
  </div>,
  document.getElementById('root')
)
