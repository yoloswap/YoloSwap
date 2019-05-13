import { tokenActionTypes } from '../actions/tokenAction';
import envConfig from '../config/env';

const initialState = {
  tokens: envConfig.TOKENS,
};

export default function tokenReducer(state = initialState, action) {
  switch (action.type) {
    case tokenActionTypes.SET_TOKENS: {
      return {
        ...state,
        tokens: action.payload
      }
    }
    default:
      return state;
  }
}
