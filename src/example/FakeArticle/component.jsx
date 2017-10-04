import React from 'react'

export default function Article(props) {
  const { red, green, likes, onClick } = props

  return (
    <article style={{ backgroundColor: red ? 'red' : green && 'green' }}>
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
