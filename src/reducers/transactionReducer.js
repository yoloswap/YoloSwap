import { txActionTypes } from '../actions/transactionAction';

const initialState = {
  tx: {
    hash: null,
    isConfirming: false,
    isBroadcasting: false,
    error: null
  },
  txHistory: [],
};

export default function transactionReducer(state = initialState, action) {
  switch (action.type) {
    case txActionTypes.SET_TX_CONFIRMING: {
      return {
        ...state,
        tx: {
          ...state.tx,
          isConfirming: action.payload
        }
      }
    }
    case txActionTypes.SET_TX_BROADCASTING: {
      return {
        ...state,
        tx: {
          ...state.tx,
          isBroadcasting: action.payload
        }
      }
    }
    case txActionTypes.SET_TX_HASH: {
      return {
        ...state,
        tx: {
          ...state.tx,
          hash: action.payload
        }
      }
    }
    case txActionTypes.SET_TX_ERROR: {
      return {
        ...state,
        tx: {
          ...state.tx,
          error: action.payload
        }
      }
    }
    case txActionTypes.RESET_TX: {
      return {
        ...state,
        tx: initialState.tx
      }
    }
    case txActionTypes.ADD_TX_DATA_HISTORY: {
      return {
        ...state,
        txHistory: [
          ...state.txHistory,
          action.payload
        ]
      }
    }
    default:
      return state;
  }
}
