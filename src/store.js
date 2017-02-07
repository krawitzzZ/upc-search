import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import apiClient from './utils/apiClient';
import createAsyncMiddleware from './reducers/middleware/async';
import rootReducer from './reducers';

let middleware = [
  createAsyncMiddleware(apiClient),
  thunk,
];

if (__DEV__) {
  middleware = [
    ...middleware,
    logger(),
  ];
}

export default compose(
  applyMiddleware(...middleware),
)(createStore)(rootReducer);
