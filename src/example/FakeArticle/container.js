import React from 'react'
import { connect } from 'react-redux'
import ArticleComponent from './component'
import UnicornRemoteFrame from '../UnicornRemoteFrame'

class ArticleContainer extends React.Component {
  render() {
    return (
      <UnicornRemoteFrame>
        <ArticleComponent {...this.props} />
      </UnicornRemoteFrame>
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

const mapDispatchToProps = dispatch => {
  return {
    onClick: () => {
      dispatch({
        type: 'LIKE_CLICKED',
        payload: 1,
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ArticleContainer)
