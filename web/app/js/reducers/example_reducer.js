import {fromJS} from 'immutable';

const initialState = fromJS({
  // initial state
});

export default (state = initialState, action) => {
  switch(action.type) {
    default:
      return state;
  }
};

