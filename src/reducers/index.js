import { combineReducers } from 'redux'
import dummyReducer from "./dummyReducer";

const reducer = combineReducers({
  dummy: dummyReducer,
});

export default reducer
