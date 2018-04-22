import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import List from 'material-ui/List/List'
import Tabs, {
  Tab,
} from 'material-ui/Tabs'
import {
  CircularProgress,
} from 'material-ui/Progress'
// import { AppState } from '../../store/app-state'
// import { TopicStore } from '../../store/topic-store'

import Container from '../components/container'
import TopicListItem from './list-item'

@inject((stores) => {
  return {
    topicStore: stores.topicStore,
    appState: stores.appState,
    user: stores.appState.user,
  }
}) @observer
export default class TopicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    }
    this.changeTab = this.changeTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }

  componentDidMount() {
    this.props.topicStore.fetchTopics()
  }

  // asyncBootstrap() {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       appState.count = 3
  //       resolve(true)
  //     })
  //   })
  // }


  changeTab(event, index) {
    this.setState({
      tabIndex: index,
    })
  }
  /* eslint-disable */
  listItemClick() {

  }
  /* eslint-enable */

  render() {
    const {
      tabIndex,
    } = this.state
    const {
      topicStore,
    } = this.props
    const topicList = topicStore.topics
    const syncing = topicStore.syncing
    return (
      <Container>
        <Helmet>
          <title>话题列表</title>
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          <Tab label="全部" />
          <Tab label="分享" />
          <Tab label="工作" />
          <Tab label="问答" />
          <Tab label="精品" />
          <Tab label="测试" />
        </Tabs>
        <List>
          {
            topicList.map(topic =>
              (<TopicListItem
                key={topic.id}
                onClick={this.listItemClick}
                topic={topic}
              />
              ))
          }
        </List>
        {
          syncing ?
            (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '40px 0',
                }}
              >
                <CircularProgress color="primary" size={100} />
              </div>
            ) :
            null
        }
      </Container>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  // appState: PropTypes.instanceOf(AppState).isRequired,
  // user: PropTypes.object.isRequired,
}
