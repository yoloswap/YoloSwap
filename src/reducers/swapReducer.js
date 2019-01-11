import { swapActionTypes } from '../actions/swapAction';

const initialState = {
  sourceToken: 'EOS',
  destToken: 'SYS',
  sourceAmount: '',
  destAmount: 0,
  tokenPairRate: 0,
  isTokenPairRateLoading: true,
  error: ''
};

export default function swapReducer(state = initialState, action) {
  switch (action.type) {
    case swapActionTypes.SET_SOURCE_TOKEN: {
      return {
        ...state,
        sourceToken: action.payload
      }
    }
    case swapActionTypes.SET_DEST_TOKEN: {
      return {
        ...state,
        destToken: action.payload
      }
    }
    case swapActionTypes.SET_SOURCE_AMOUNT: {
      return {
        ...state,
        sourceAmount: action.payload
      }
    }
    case swapActionTypes.SET_DEST_AMOUNT: {
      return {
        ...state,
        destAmount: action.payload
      }
    }
    case swapActionTypes.SET_TOKEN_PAIR_RATE: {
      return {
        ...state,
        tokenPairRate: action.payload
      }
    }
    case swapActionTypes.SET_TOKEN_PAIR_RATE_LOADING: {
      return {
        ...state,
        isTokenPairRateLoading: action.payload
      }
    }
    case swapActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      }
    }
    default:
      return state;
  }
}
