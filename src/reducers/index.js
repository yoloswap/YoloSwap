import { combineReducers } from 'redux'
import tokenReducer from "./tokenReducer";
import accountReducer from "./accountReducer";

const reducer = combineReducers({
  token: tokenReducer,
  account: accountReducer,
});

export default reducer
