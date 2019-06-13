import { globalActionTypes } from '../actions/globalAction';

const initialState = {
  isErrorActive: false,
  errorMessage: '',
  errorType: '',
  widgetMode: false
};

export default function globalReducer(state = initialState, action) {
  switch (action.type) {
    case globalActionTypes.SET_GLOBAL_ERROR: {
      const { isErrorActive, errorMessage, errorType } = action.payload;
      return { ...state, isErrorActive, errorMessage, errorType }
    }
    case globalActionTypes.SET_WIDGET_MODE: {
      return { ...state, widgetMode: action.payload }
    }
    default:
      return state;
  }
}
