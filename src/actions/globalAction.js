export const globalActionTypes = {
  SET_GLOBAL_ERROR: 'GLOBAL.SET_GLOBAL_ERROR',
};

export function setGlobalError(isErrorActive, errorMessage = '', errorType = '') {
  return {
    type: globalActionTypes.SET_GLOBAL_ERROR,
    payload: { isErrorActive, errorMessage, errorType }
  }
}
