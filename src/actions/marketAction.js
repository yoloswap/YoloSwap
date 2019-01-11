export const marketActionTypes = {
  FETCH_MARKET_RATES: 'MARKET.FETCH_MARKET_RATES',
  SET_INDEX_TOKEN: 'MARKET.SET_INDEX_TOKEN',
  SET_LOADING: 'MARKET.SET_LOADING',
};

export function fetchMarketRates() {
  return {
    type: marketActionTypes.FETCH_MARKET_RATES
  }
}

export function setIndexToken(token) {
  return {
    type: marketActionTypes.SET_INDEX_TOKEN,
    payload: token
  }
}

export function setLoading(isLoading) {
  return {
    type: marketActionTypes.SET_LOADING,
    payload: isLoading
  }
}
