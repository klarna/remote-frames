import React from 'react'
import { connect } from 'react-redux'
import ArticleComponent from './component'
import RemoteFrame from '../../RemoteFrame'

class ArticleContainer extends React.Component {
  render() {
    return (
      <RemoteFrame id="Inside the article">
        <ArticleComponent {...this.props} />
      </RemoteFrame>
    )
  }
}

const mapStateToProps = state => {
  return {
    likes: state.likes,
    red: state.red,
    green: state.green,
  }
}

let globalDispatch = () => {}

const onClickHandler = () =>
  globalDispatch({
    type: 'LIKE_CLICKED',
    payload: 1,
  })

const mapDispatchToProps = dispatch => {
  globalDispatch = dispatch

  return {
    onClick: onClickHandler,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ArticleContainer)
