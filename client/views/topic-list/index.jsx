import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Button from 'material-ui/Button';
import {
  AppState,
} from '../../store/app-state'

import Container from '../components/container'

@inject('appState')
@observer
export default class TopicList extends React.Component {
  constructor(props) {
    super(props);
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {
    // console.log(this.props.appState)
  }

  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true)
      })
    })
  }

  changeName(event) {
    this.props.appState.changeName(event.target.value);
  }

  render() {
    return (
      <Container>
        <Helmet>
          <title>话题列表</title>
        </Helmet>
        <Button raised color="primary">This a  button </Button>
        <input type="text" onChange={this.changeName} />
        <span>
          {this.props.appState.name}
        </span>
      </Container>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
