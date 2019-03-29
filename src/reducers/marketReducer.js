import { marketActionTypes } from '../actions/marketAction';
import envConfig from "../config/env";

const initialState = {
  isLoading: true,
  isBackgroundLoading: false,
  indexToken: envConfig.EOS,
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
    case marketActionTypes.SET_BACKGROUND_LOADING: {
      return {
        ...state,
        isBackgroundLoading: action.payload
      }
    }
    default:
      return state;
  }
}
