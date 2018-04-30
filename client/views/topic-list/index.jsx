import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import queryString from 'query-string'

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
import {
  tabs,
} from '../../util/variable-define'

@inject((stores) => {
  return {
    topicStore: stores.topicStore,
    user: stores.appState.user,
  }
}) @observer
export default class TopicList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
    }
    this.changeTab = this.changeTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
    this.getTab = this.getTab.bind(this)
    this.fetchTopic = this.fetchTopic.bind(this)
  }

  componentDidMount() {
    this.fetchTopic()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.fetchTopic(nextProps.location)
      // this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }

  getTab(search) {
    search = search || this.props.location.search
    const query = queryString.parse(search)
    return query.tab || 'all'
  }

  asyncBootstrap() {
    const query = queryString.parse(this.props.location.search)
    const tab = query.tab
    return this.props.topicStore.fetchTopics(tab || 'all').then(() => {
      return true
    }).catch(() => {
      return false
    })
  }

  fetchTopic(location) {
    location = location || this.props.location
    const query = queryString.parse(location.search)
    const tab = query.tab
    this.props.topicStore.fetchTopics(tab || 'all')
  }

  changeTab(event, value) {
    // change route here
    this.context.router.history.push({
      // pathname: '/index',
      search: `?tab=${value}`,
    })
  }

  listItemClick(topic) {
    this.context.router.history.push(`/detail/${topic.id}`)
  }

  render() {
    const {
      topicStore,
    } = this.props
    const topicList = topicStore.topics
    const syncing = topicStore.syncing
    // const query = queryString.parse(this.props.location.search)
    const tab = this.getTab()
    return (
      <Container>
        <Helmet>
          <title>话题列表</title>
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {
            Object.keys(tabs).map(t => <Tab key={t} label={tabs[t]} value={t} />)
          }
        </Tabs>
        <List>
          {
            topicList.map(topic =>
              (<TopicListItem
                key={topic.id}
                onClick={() => this.listItemClick(topic)}
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

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}
