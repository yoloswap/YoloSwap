export const globalActionTypes = {
  SET_GLOBAL_ERROR: 'GLOBAL.SET_GLOBAL_ERROR',
  SET_WIDGET_MODE: 'GLOBAL.SET_WIDGET_MODE',
};

export function setGlobalError(isErrorActive, errorMessage = '', errorType = '') {
  return {
    type: globalActionTypes.SET_GLOBAL_ERROR,
    payload: { isErrorActive, errorMessage, errorType }
  }
}

export function setWidgetMode(isWidgetMode = true) {
  return {
    type: globalActionTypes.SET_WIDGET_MODE,
    payload: isWidgetMode
  }
}
