import { globalActionTypes } from '../actions/globalAction';

const initialState = {
  isErrorActive: false,
  errorMessage: '',
};

export default function globalReducer(state = initialState, action) {
  switch (action.type) {
    case globalActionTypes.SET_GLOBAL_ERROR: {
      const { isErrorActive, errorMessage } = action.payload;
      return { ...state, isErrorActive, errorMessage }
    }
    default:
      return state;
  }
}
