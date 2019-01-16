export const swapActionTypes = {
  FETCH_TOKEN_PAIR_RATE: 'SWAP.FETCH_TOKEN_PAIR_RATE',
  SET_TOKEN_PAIR_RATE_LOADING: 'SWAP.SET_TOKEN_PAIR_RATE_LOADING',
  SET_TOKEN_PAIR_RATE: 'SWAP.SET_TOKEN_PAIR_RATE',
  SWAP_TOKEN: 'SWAP.SWAP_TOKEN',
  SET_SOURCE_TOKEN: 'SWAP.SET_SOURCE_TOKEN',
  SET_DEST_TOKEN: 'SWAP.SET_DEST_TOKEN',
  SET_SOURCE_AMOUNT: 'SWAP.SET_SOURCE_AMOUNT',
  SET_DEST_AMOUNT: 'SWAP.SET_DEST_AMOUNT',
  SET_TX_CONFIRMING: 'SWAP.SET_TX_CONFIRMING',
  SET_TX_BROADCASTING: 'SWAP.SET_TX_BROADCASTING',
  SET_TX_ID: 'SWAP.SET_TX_ID',
  SET_TX_ERROR: 'SWAP.SET_TX_ERROR',
  RESET_TX: 'SWAP.RESET_TX',
  SET_ERROR: 'SWAP.SET_ERROR',
};

export function fetchTokenPairRate() {
  return {
    type: swapActionTypes.FETCH_TOKEN_PAIR_RATE
  }
}

export function swapToken() {
  return {
    type: swapActionTypes.SWAP_TOKEN
  }
}

export function setSourceToken(token) {
  return {
    type: swapActionTypes.SET_SOURCE_TOKEN,
    payload: token
  }
}

export function setDestToken(token) {
  return {
    type: swapActionTypes.SET_DEST_TOKEN,
    payload: token
  }
}

export function setSourceAmount(amount) {
  return {
    type: swapActionTypes.SET_SOURCE_AMOUNT,
    payload: amount
  }
}

export function setDestAmount(amount) {
  return {
    type: swapActionTypes.SET_DEST_AMOUNT,
    payload: amount
  }
}

export function setTokenPairRate(rate) {
  return {
    type: swapActionTypes.SET_TOKEN_PAIR_RATE,
    payload: rate
  }
}

export function setTokenPairRateLoading(isLoading) {
  return {
    type: swapActionTypes.SET_TOKEN_PAIR_RATE_LOADING,
    payload: isLoading
  }
}

export function setError(message) {
  return {
    type: swapActionTypes.SET_ERROR,
    payload: message
  }
}

export function setTxConfirming(isConfirming) {
  return {
    type: swapActionTypes.SET_TX_CONFIRMING,
    payload: isConfirming
  }
}

export function setTxBroadcasting(isBroadcasting) {
  return {
    type: swapActionTypes.SET_TX_BROADCASTING,
    payload: isBroadcasting
  }
}

export function setTxId(txId) {
  return {
    type: swapActionTypes.SET_TX_ID,
    payload: txId
  }
}

export function setTxError(message) {
  return {
    type: swapActionTypes.SET_TX_ERROR,
    payload: message
  }
}

export function resetTx() {
  return {
    type: swapActionTypes.RESET_TX
  }
}
