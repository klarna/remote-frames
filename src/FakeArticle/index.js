import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import ArticleContainer from './container'

const initialState = {
  likes: 0,
  red: true,
  green: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LIKE_CLICKED':
      return { ...state, likes: state.likes + action.payload }
    default:
      return state
  }
}

const store = createStore(reducer)

export default function FakeArticle() {
  return (
    <Provider store={store}>
      <ArticleContainer />
    </Provider>
  )
}
