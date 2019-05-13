import { globalActionTypes } from '../actions/globalAction';

const initialState = {
  isErrorActive: false,
  errorMessage: '',
  errorType: '',
};

export default function globalReducer(state = initialState, action) {
  switch (action.type) {
    case globalActionTypes.SET_GLOBAL_ERROR: {
      const { isErrorActive, errorMessage, errorType } = action.payload;
      return { ...state, isErrorActive, errorMessage, errorType }
    }
    default:
      return state;
  }
}
