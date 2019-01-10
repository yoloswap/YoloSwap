export const tokenActionTypes = {
  FETCH_MARKET_RATES: 'TOKEN.FETCH_MARKET_RATES',
  FETCH_TOKEN_PAIR_RATE: 'TOKEN.FETCH_TOKEN_PAIR_RATE',
  SWAP_TOKEN: 'TOKEN.SWAP_TOKEN',
  SET_TOKENS: 'TOKEN.SET_TOKENS',
  SET_MARKET_BASED_TOKEN: 'TOKEN.SET_MARKET_BASED_TOKEN',
  SET_SOURCE_TOKEN: 'TOKEN.SET_SOURCE_TOKEN',
  SET_DEST_TOKEN: 'TOKEN.SET_DEST_TOKEN',
  SET_SOURCE_AMOUNT: 'TOKEN.SET_SOURCE_AMOUNT',
  SET_DEST_AMOUNT: 'TOKEN.SET_DEST_AMOUNT',
  SET_TOKEN_PAIR_RATE: 'TOKEN.SET_TOKEN_PAIR_RATE',
  SET_MARKING_LOADING: 'TOKEN.SET_MARKING_LOADING',
  SET_TOKEN_PAIR_RATE_LOADING: 'TOKEN.SET_TOKEN_PAIR_RATE_LOADING',
  SET_ERROR: 'TOKEN.SET_ERROR',
};

export function setTokens(tokens) {
  return {
    type: tokenActionTypes.SET_TOKENS,
    payload: tokens
  }
}

export function fetchTokenPairRate() {
  return {
    type: tokenActionTypes.FETCH_TOKEN_PAIR_RATE
  }
}

export function fetchMarketRates() {
  return {
    type: tokenActionTypes.FETCH_MARKET_RATES
  }
}

export function swapToken() {
  return {
    type: tokenActionTypes.SWAP_TOKEN
  }
}

export function setMarketBasedToken(token) {
  return {
    type: tokenActionTypes.SET_MARKET_BASED_TOKEN,
    payload: token
  }
}

export function setSourceToken(token) {
  return {
    type: tokenActionTypes.SET_SOURCE_TOKEN,
    payload: token
  }
}

export function setDestToken(token) {
  return {
    type: tokenActionTypes.SET_DEST_TOKEN,
    payload: token
  }
}

export function setSourceAmount(amount) {
  return {
    type: tokenActionTypes.SET_SOURCE_AMOUNT,
    payload: amount
  }
}

export function setDestAmount(amount) {
  return {
    type: tokenActionTypes.SET_DEST_AMOUNT,
    payload: amount
  }
}

export function setTokenPairRate(rate) {
  return {
    type: tokenActionTypes.SET_TOKEN_PAIR_RATE,
    payload: rate
  }
}

export function setMarketLoading(isLoading) {
  return {
    type: tokenActionTypes.SET_MARKING_LOADING,
    payload: isLoading
  }
}

export function setTokenPairRateLoading(isLoading) {
  return {
    type: tokenActionTypes.SET_TOKEN_PAIR_RATE_LOADING,
    payload: isLoading
  }
}

export function setError(message) {
  return {
    type: tokenActionTypes.SET_ERROR,
    payload: message
  }
}
