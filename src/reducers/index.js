import { combineReducers } from 'redux'
import tokenReducer from "./tokenReducer";
import accountReducer from "./accountReducer";
import swapReducer from "./swapReducer";
import marketReducer from "./marketReducer";

const reducer = combineReducers({
  token: tokenReducer,
  account: accountReducer,
  swap: swapReducer,
  market: marketReducer,
});

export default reducer
