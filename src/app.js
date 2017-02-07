import React from 'react';
import { Provider } from 'react-redux';
import App from '@containers/app/App';
import store from './store';


export default class TestApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
