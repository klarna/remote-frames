import React from 'react'
import PropTypes from 'prop-types'
import { compose, defaultProps, getContext } from 'recompose'

function Article(props) {
  const { likes, onClick, theme } = props

  return (
    <article
      style={{
        borderWidth: 2,
        borderColor: theme.borderColor,
        borderStyle: 'dashed',
        backgroundColor: theme.backgroundColor,
      }}
    >
      <h1>Hello World!</h1>
      <strong>{likes} people like this article</strong>
      <button onClick={onClick}>Like</button>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur convallis ex nulla, sit
        amet lacinia tortor consequat ut. Aenean ut molestie nunc. Praesent porta purus vel eros
        finibus auctor. Phasellus felis massa, pulvinar vel tortor vel, luctus facilisis dui. Morbi
        congue justo massa, ac fermentum sapien auctor et. Vivamus eget consectetur turpis. Vivamus
        eu nunc sit amet leo dapibus consectetur. Duis aliquam egestas sapien, dictum vehicula risus
        elementum id.
      </p>
    </article>
  )
}

export default compose(
  getContext({
    theme: PropTypes.object,
  }),
  defaultProps({
    theme: {
      borderColor: 'blue',
      backgroundColor: 'lightgray',
    },
  })
)(Article)
