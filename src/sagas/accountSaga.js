import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as tokenAction from "../actions/tokenAction";
import * as accountActions from "../actions/accountAction";
import * as globalActions from "../actions/globalAction";
import { getBalances } from "../services/network_service";
import * as scatterService from "../services/scatter_service";
import { SCATTER_ERROR_TYPE } from '../config/app';

const getTokens = state => state.token.tokens;
const getAccountData = state => state.account;

function* connectToScatter(action) {
  yield put(accountActions.setScatterLoading(true));

  try {
    const isIdentityNeeded = action.payload;

    const result = yield call(scatterService.connect, isIdentityNeeded);

    if (result) {
      yield put(accountActions.setScatterAccount(result.account));
      yield put(accountActions.setScatterEos(result.eos));
      yield put(accountActions.setScatterLoading(false));
      yield call(fetchBalances);
    } else if (result === false) {
      yield put(accountActions.setScatterLoading(false));
      yield put(globalActions.setGlobalError(true, '', SCATTER_ERROR_TYPE));
    } else {
      yield put(accountActions.setScatterLoading(false));
    }
  } catch (e) {
    yield put(accountActions.setScatterLoading(false));
  }
}

function* disconnectFromScatter() {
  yield call(scatterService.disconnect);

  yield put(accountActions.setScatterAccount(null));

  const tokens = yield select(getTokens);
  const tokensWithoutBalance = tokens.map((token) => {
    delete token.balance;
    return token;
  });
  yield put(tokenAction.setTokens(tokensWithoutBalance));
}

function* fetchBalances() {
  try {
    yield put(accountActions.setBalanceLoading(true));

    const tokens = yield select(getTokens);
    const account = yield select(getAccountData);
    let tokenSymbols = [], tokenContracts = [];

    tokens.forEach((token) => {
      tokenSymbols.push(token.symbol);
      tokenContracts.push(token.account);
    });

    const balances = yield call(
      getBalances,
      {
        eos: account.eos,
        account: account.account.name,
        tokenSymbols: tokenSymbols,
        tokenContracts: tokenContracts,
      }
    );

    const tokensWithBalance = tokens.map((token, index) => {
      token.balance = balances[index]
      return token;
    });

    yield put(tokenAction.setTokens(tokensWithBalance));
  } catch (e) {
    console.log(e);
  }

  yield put(accountActions.setBalanceLoading(false));
}

export default function* accountWatcher() {
  yield takeLatest(accountActions.accountActionTypes.CONNECT_TO_SCATTER, connectToScatter);
  yield takeLatest(accountActions.accountActionTypes.DISCONNECT_FROM_SCATTER, disconnectFromScatter);
  yield takeLatest(accountActions.accountActionTypes.FETCH_BALANCE, fetchBalances);
}
