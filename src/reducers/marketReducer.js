import { marketActionTypes } from '../actions/marketAction';
import { EOS_TOKEN } from "../config/tokens";

const initialState = {
  isLoading: true,
  indexToken: EOS_TOKEN,
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
