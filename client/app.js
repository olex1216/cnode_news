import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import App from './views/App';
// import appState from './store/app-state';

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider >
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default // eslint-disable-line
    render(NextApp)
  })
}
