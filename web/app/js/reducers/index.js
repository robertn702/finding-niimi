import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import exampleReducer from './example_reducer';

export default combineReducers(Object.assign({}, {
  routing: routerReducer,
  example: exampleReducer
}));
