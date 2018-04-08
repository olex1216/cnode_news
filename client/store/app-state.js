import {
  observable,
  computed,
  action,
} from 'mobx';

export class AppState {
  @observable count = 0
  @observable name = 'olex'
  @computed get msg() {
    return "dg"
  }
  @action add() {
    this.count +=1;
  }

  @action changeName(name) {
    this.name = name
  }
}

const appState = new AppState()

export default appState
