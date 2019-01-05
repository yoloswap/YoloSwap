const initialState = {
  message: 'initial message'
};

export default function dummyReducer(state = initialState, action) {
  switch (action.type) {
    case "DUMMY.DUMMY_ACTION": {
      return {
        ...state,
        message: action.payload
      }
    }
    default:
      return state;
  }
}
