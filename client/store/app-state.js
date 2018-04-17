import {
  observable,
  action,
} from 'mobx';

export default class AppState {
  constructor({
    count,
    name,
  } = {
    count: 0,
    name: 'olex',
  }) {
    this.count = count
    this.name = name
  }
  @observable count
  @observable name

  @action add() {
    this.count += 1;
  }

  @action changeName(name) {
    this.name = name
  }

  toJson() {
    return {
      count: this.count,
      name: this.name,
    }
  }
}
