export const txActionTypes = {
  SET_TX_CONFIRMING: 'TX.SET_TX_CONFIRMING',
  SET_TX_BROADCASTING: 'TX.SET_TX_BROADCASTING',
  SET_TX_HASH: 'TX.SET_TX_HASH',
  SET_TX_ERROR: 'TX.SET_TX_ERROR',
  RESET_TX: 'TX.RESET_TX',
  ADD_TX_DATA_HISTORY: 'TX.ADD_TX_DATA_HISTORY',
};

export function setTxConfirming(isConfirming) {
  return {
    type: txActionTypes.SET_TX_CONFIRMING,
    payload: isConfirming
  }
}

export function setTxBroadcasting(isBroadcasting) {
  return {
    type: txActionTypes.SET_TX_BROADCASTING,
    payload: isBroadcasting
  }
}

export function setTxHash(txHash) {
  return {
    type: txActionTypes.SET_TX_HASH,
    payload: txHash
  }
}

export function setTxError(message) {
  return {
    type: txActionTypes.SET_TX_ERROR,
    payload: message
  }
}

export function resetTx() {
  return {
    type: txActionTypes.RESET_TX
  }
}

export function addTxDataToHistory(txData) {
  return {
    type: txActionTypes.ADD_TX_DATA_HISTORY,
    payload: txData
  }
}
