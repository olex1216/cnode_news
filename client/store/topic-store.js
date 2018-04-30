import {
  observable,
  toJS,
  computed,
  action,
  extendObservable,
  runInAction,
} from 'mobx'
import {
  get,
  post,
} from '../util/http'
import {
  topicSchema,
  // replySchema,
} from '../util/variable-define'

const createTopic = (topic) => {
  return Object.assign({}, topicSchema, topic)
}

// const createReply = (reply) => {
//   return Object.assign({}, replySchema, reply)
// }

export class Topic {
  constructor(data, isDetail) {
    extendObservable(this, data)
    this.isDetail = isDetail
  }
  @observable createdReplies = []
  @observable syncing = false

  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`/topic/${this.id}/replies`, {
        needAccessToken: true,
      },
      {
        content,
      })
        .then(data => {
          if (data.success) {
            this.createdReplies.push({
              create_at: Date.now(),
              id: data.reply_id,
              content,
            })
            resolve({
              replyId: data.reply_id,
              content,
            })
          } else {
            reject()
          }
        }).catch(reject)
    })
  }
}

export default class TopicStore {
  @observable topics
  @observable details
  @observable createdTopics
  @observable syncing = false
  @observable tab

  constructor({ syncing = false, topics = [], tab = null, details = [], createdTopics = [] } = {}) {
    this.syncing = syncing
    this.topics = topics.map(topic => new Topic(createTopic(topic)))
    this.details = details.map(topic => new Topic(createTopic(topic)))
    this.createdTopics = createdTopics.map(topic => new Topic(createTopic(topic)))
    this.tab = tab
  }

  @computed get topicMap() {
    return this.topics.reduce((result, topic) => {
      result[topic.id] = topic
      return result
    }, {})
  }

  // 自动计算某一话题下的detail，生成map
  @computed get detailsMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail
      return result
    }, {})
  }

  @action addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
  }


  // 话题列表
  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length > 0) {
        resolve()
      } else {
        this.tab = tab
        this.syncing = true
        this.topics = []
        get('topics', {
          mdrender: false,
          tab,
        }).then((resp) => {
          runInAction(() => {
            if (resp.success) {
              const topics = resp.data.map(topic => {
                return (new Topic(createTopic(topic)))
              })
              this.topics = topics
              this.syncing = false
              resolve()
            } else {
              reject()
            }
            this.syncing = false
          })
        }).catch((err) => {
          this.syncing = false
          reject(err)
        })
      }
    });
  }

  // 话题详情
  @action getTopicDetail(id) {
    console.log('get topic id:', id) // eslint-disable-line
    return new Promise((resolve, reject) => {
      if (this.detailsMap[id]) {
        resolve(this.detailsMap[id])
      } else {
        get(`/topic/${id}`, {
          mdrender: false,
        }).then(resp => {
          if (resp.success === true) {
            const topic = new Topic(createTopic(resp.data), true)
            this.details.push(topic)
            resolve(topic)
          } else {
            reject()
          }
        }).catch(err => {
          reject(err)
        })
      }
    });
  }

  // 发布话题
  @action createTopic(title, tab, content) {
    return new Promise((resolve, reject) => {
      post('/topics', {
        needAccessToken: true,
      }, {
        title, tab, content,
      })
        .then(data => {
          console.log(data) // eslint-disable-line
          if (data.success) {
            const topic = {
              title,
              tab,
              content,
              id: data.topic_id,
              create_at: Date.now(),
            }
            this.createdTopics.push(new Topic(createTopic(topic)))
            resolve(topic)
          } else {
            console.log('我错了吗') // eslint-disable-line
            reject(new Error(data.error_msg || '未知错误'))
          }
        })
        .catch((err) => {
          console.log(err) // eslint-disable-line
          if (err.response) {
            reject(new Error(err.response.data.error_msg || '未知错误'))
          } else {
            reject(new Error('未知错误'))
          }
        })
    })
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      syncing: toJS(this.syncing),
      details: toJS(this.details),
      tab: this.tab,
    }
  }
}
