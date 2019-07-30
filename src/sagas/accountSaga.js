import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as accountActions from "../actions/accountAction";
import * as globalActions from "../actions/globalAction";
import * as scatterService from "../services/scatter_service";
import appConfig from '../config/app';
import { fetchTokenPairRate } from "./swapSaga";
import { getTokenBalances } from "./serviceSaga/eosServiceSaga";
import { validateInputParams } from "./swapSaga";

const getTokens = state => state.token.tokens;
const getAccountData = state => state.account;

function* connectToScatter(action) {
  try {
    const { isLoadingNeeded, firstTimeConnect } = action.payload;

    yield put(accountActions.setScatterLoading(isLoadingNeeded));

    const result = yield call(scatterService.connect, firstTimeConnect);

    if (result) {
      yield put(accountActions.setScatterAccount(result.account));
      yield put(accountActions.setScatterEos(result.eos));
      yield put(accountActions.setScatterLoading(false));
      yield call(fetchBalances);
    } else if (result === false) {
      yield put(accountActions.setScatterLoading(false));

      if (isLoadingNeeded) {
        yield put(globalActions.setGlobalError(true, '', appConfig.SCATTER_ERROR_TYPE));
      }
    }
  } catch (e) {
    yield put(accountActions.setScatterLoading(false));
  }
}

function* disconnectFromScatter() {
  yield call(scatterService.disconnect);

  yield put(accountActions.setScatterAccount(null));

  let tokens = yield select(getTokens);

  tokens.map((token) => {
    delete token.balance;
    return token;
  });

  yield call(fetchTokenPairRate);
}

function* fetchBalances() {
  try {
    yield put(accountActions.setBalanceLoading(true));

    const account = yield select(getAccountData);
    let tokens = yield select(getTokens);
    let tokenSymbols = [], tokenContracts = [];

    tokens.forEach((token) => {
      tokenSymbols.push(token.symbol);
      tokenContracts.push(token.account);
    });

    const balances = yield call(getTokenBalances, account.eos, account.account.name, tokenSymbols, tokenContracts);

    tokens.map((token, index) => {
      token.balance = balances[index];
      return token;
    });

    yield call(validateInputParams);
  } catch (e) {
    console.log(e);
  }

  yield put(accountActions.setBalanceLoading(false));
}

function* setAccountWithBalances(action) {
  const account = action.payload;

  yield put(accountActions.setScatterAccount(account));
  yield call(fetchBalances);
}

export default function* accountWatcher() {
  yield takeLatest(accountActions.accountActionTypes.CONNECT_TO_SCATTER, connectToScatter);
  yield takeLatest(accountActions.accountActionTypes.DISCONNECT_FROM_SCATTER, disconnectFromScatter);
  yield takeLatest(accountActions.accountActionTypes.FETCH_BALANCE, fetchBalances);
  yield takeLatest(accountActions.accountActionTypes.SET_ACCOUNT_WITH_BALANCES, setAccountWithBalances);
}
