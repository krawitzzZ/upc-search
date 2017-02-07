import { combineReducers } from 'redux';
import product from './product';

const appReducer = combineReducers({
  product,
});

const rootReducer = (state, action) => {
  const newState = (action.type === 'RESET') ? undefined : state;
  return appReducer(newState, action);
};

export default rootReducer;
