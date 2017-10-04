import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ArticleComponent from './component'
import UnicornRemoteFrame from '../../UnicornRemoteFrame'

class ArticleContainer extends React.Component {
  render() {
    return (
      <UnicornRemoteFrame contextTypes={{ theme: PropTypes.object }}>
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
