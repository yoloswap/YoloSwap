import { accountActionTypes } from '../actions/accountAction';
import {account} from '../account.js'

const initialState = {
  name: account.account,
  eos: account.eos,
  balances: [],
  isBalanceLoading: true,
};

export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case accountActionTypes.SET_BALANCES: {
      return {
        ...state,
        balances: action.payload
      }
    }
    case accountActionTypes.SET_BALANCE_LOADING: {
      return {
        ...state,
        isBalanceLoading: action.payload
      }
    }
    default:
      return state;
  }
}
