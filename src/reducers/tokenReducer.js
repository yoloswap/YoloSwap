import { tokenActionTypes } from '../actions/tokenAction';
import { TOKENS } from '../config/tokens';

const initialState = {
  list: TOKENS,
  isMarketLoading: true,
  isTokenPairRateLoading: true,
  marketBasedToken: 'EOS',
  sourceToken: 'EOS',
  destToken: 'SYS',
  sourceAmount: '',
  destAmount: 0,
  tokenPairRate: 0,
  error: ''
};

export default function tokenReducer(state = initialState, action) {
  switch (action.type) {
    case tokenActionTypes.SET_TOKENS: {
      return {
        ...state,
        list: action.payload
      }
    }
    case tokenActionTypes.SET_MARKET_BASED_TOKEN: {
      return {
        ...state,
        marketBasedToken: action.payload
      }
    }
    case tokenActionTypes.SET_SOURCE_TOKEN: {
      return {
        ...state,
        sourceToken: action.payload
      }
    }
    case tokenActionTypes.SET_DEST_TOKEN: {
      return {
        ...state,
        destToken: action.payload
      }
    }
    case tokenActionTypes.SET_SOURCE_AMOUNT: {
      return {
        ...state,
        sourceAmount: action.payload
      }
    }
    case tokenActionTypes.SET_DEST_AMOUNT: {
      return {
        ...state,
        destAmount: action.payload
      }
    }
    case tokenActionTypes.SET_TOKEN_PAIR_RATE: {
      return {
        ...state,
        tokenPairRate: action.payload
      }
    }
    case tokenActionTypes.SET_MARKING_LOADING: {
      return {
        ...state,
        isMarketLoading: action.payload
      }
    }
    case tokenActionTypes.SET_TOKEN_PAIR_RATE_LOADING: {
      return {
        ...state,
        isTokenPairRateLoading: action.payload
      }
    }
    case tokenActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      }
    }
    default:
      return state;
  }
}
