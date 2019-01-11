import { marketActionTypes } from '../actions/marketAction';

const initialState = {
  isLoading: true,
  indexToken: 'EOS',
};

export default function marketReducer(state = initialState, action) {
  switch (action.type) {
    case marketActionTypes.SET_INDEX_TOKEN: {
      return {
        ...state,
        indexToken: action.payload
      }
    }
    case marketActionTypes.SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload
      }
    }
    default:
      return state;
  }
}
