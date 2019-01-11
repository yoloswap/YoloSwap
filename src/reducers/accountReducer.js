import { accountActionTypes } from '../actions/accountAction';

const initialState = {
  eos: null,
  account: null,
  isBalanceLoading: false,
  isScatterLoading: false,
  isConfirmLoading: false,
};

export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case accountActionTypes.SET_BALANCE_LOADING: {
      return {
        ...state,
        isBalanceLoading: action.payload
      }
    }
    case accountActionTypes.SET_SCATTER_EOS: {
      return {
        ...state,
        eos: action.payload
      }
    }
    case accountActionTypes.SET_SCATTER_ACCOUNT: {
      return {
        ...state,
        account: action.payload
      }
    }
    case accountActionTypes.SET_SCATTER_LOADING: {
      return {
        ...state,
        isScatterLoading: action.payload
      }
    }
    case accountActionTypes.SET_SCATTER_CONFIRM_LOADING: {
      return {
        ...state,
        isConfirmLoading: action.payload
      }
    }
    default:
      return state;
  }
}
