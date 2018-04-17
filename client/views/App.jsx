import React from 'react'
import {
  withRouter,
} from 'react-router-dom'
import PropTypes from 'prop-types'

import Routes from '../config/router'
import AppBar from './components/app-bar'

class App extends React.Component {
  componentDidMount() {
    //
  }

  render() {
    return [
      <AppBar location={this.props.location} key="app-bar" />,
      <Routes key="routes" />,
    ]
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired,
}

export default withRouter(App)
