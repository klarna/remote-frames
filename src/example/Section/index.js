import React from 'react'
import PropTypes from 'prop-types'
import { compose, defaultProps, getContext } from 'recompose'

const Section = ({ values }) => (
  <section>
    <ul>{values.map(value => <li>{value}</li>)}</ul>
  </section>
)

export default compose(
  getContext({
    values: PropTypes.array,
  }),
  defaultProps({
    values: ['not', 'from', 'context'],
  })
)(Section)
