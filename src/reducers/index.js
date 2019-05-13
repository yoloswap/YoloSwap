import { combineReducers } from 'redux'
import tokenReducer from "./tokenReducer";
import accountReducer from "./accountReducer";
import swapReducer from "./swapReducer";
import marketReducer from "./marketReducer";
import globalReducer from "./globalReducer";
import transactionReducer from "./transactionReducer";

const reducer = combineReducers({
  token: tokenReducer,
  account: accountReducer,
  swap: swapReducer,
  market: marketReducer,
  global: globalReducer,
  transaction: transactionReducer,
});

export default reducer
