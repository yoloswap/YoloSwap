export const dummyActionTypes = {
  DUMMY_ACTION: 'DUMMY_ACTION',
};

export function setDummyMessage(message) {
  return {
    type: dummyActionTypes.DUMMY_ACTION,
    payload: message
  }
}
