import React from 'react'
// import {
//   observer,
//   inject,
// } from 'mobx-react'
// import PropTypes from 'prop-types';
// import { AppState } from '../../store/app-state';
// @inject('appState')
// @observer
export default class TopicList extends React.Component {
  componentDidMount() {

  }

  // changeName(event){
  //   this.props.appState.changeName(event.target.value);
  // }

  render() {
    return (
      <div>
        <input type="text" onChange={this.changeName} />
        <span>
          hhhhhh
        </span>
      </div>
    )
  }
}

// TopicList.propTypes = {
//   appState: PropTypes.instanceOf(AppState).isRequired,
// }
