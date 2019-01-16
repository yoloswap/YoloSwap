import { combineReducers } from 'redux'
import tokenReducer from "./tokenReducer";
import accountReducer from "./accountReducer";
import swapReducer from "./swapReducer";
import marketReducer from "./marketReducer";
import globalReducer from "./globalReducer";

const reducer = combineReducers({
  token: tokenReducer,
  account: accountReducer,
  swap: swapReducer,
  market: marketReducer,
  global: globalReducer,
});

export default reducer
