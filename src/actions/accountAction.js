export const accountActionTypes = {
  FETCH_BALANCES: 'ACCOUNT.FETCH_BALANCES',
  SET_BALANCES: 'ACCOUNT.SET_BALANCES',
  SET_BALANCE_LOADING: 'ACCOUNT.SET_BALANCE_LOADING',
};

export function fetchBalances() {
  return {
    type: accountActionTypes.FETCH_BALANCES
  }
}

export function setBalances(balances) {
  return {
    type: accountActionTypes.SET_BALANCES,
    payload: balances
  }
}

export function setBalanceLoading(isLoading) {
  return {
    type: accountActionTypes.SET_BALANCE_LOADING,
    payload: isLoading
  }
}
