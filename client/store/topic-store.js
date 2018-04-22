import {
  observable,
  toJS,
  // computed,
  action,
  extendObservable,
  // runInAction,
} from 'mobx'
import {
  get,
  // post,
} from '../util/http'
import {
  topicSchema,
} from '../util/variable-define'

const createTopic = (data) => {
  const topic = Object.assign({}, topicSchema, data)
  return topic
}

export class Topic {
  constructor(data) {
    extendObservable(this, data)
  }
}

export default class TopicStore {
  @observable topics
  @observable details
  @observable createdTopics
  @observable syncing = false
  @observable tab = undefined

  constructor({ syncing = false, topics = [] } = {}) {
    this.syncing = syncing
    this.topics = topics.map(topic => new Topic(createTopic(topic)))
  }

  @action addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
  }

  @action fetchTopics() {
    return new Promise((resolve, reject) => {
      this.syncing = true
      this.topics = []
      get('topics', {
        mdrender: false,
      }).then((resp) => {
        // runInAction(() => {
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
        // })
      }).catch((err) => {
        this.syncing = false
        reject(err)
      })
    });
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      syncing: toJS(this.syncing),
    }
  }
}
