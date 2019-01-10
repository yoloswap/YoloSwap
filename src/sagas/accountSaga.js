import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as accountAction from "../actions/accountAction";
import { getBalances } from "../services/network_service";
import * as scatterService from "../services/scatter_service";

const getTokens = state => state.token.list;
const getAccountData = state => state.account;

function* connectToScatter() {
  yield put(accountAction.setScatterLoading(true));

  try {
    const { account, eos } = yield call(scatterService.connect);

    yield put(accountAction.setScatterAccount(account));
    yield put(accountAction.setScatterEos(eos));

    yield call(fetchBalances);
  } catch (e) {
    console.log(e);
  }

  yield put(accountAction.setScatterLoading(false));
}

function* fetchBalances() {
  try {
    yield put(accountAction.setBalanceLoading(true));

    const tokens = yield select(getTokens);
    const account = yield select(getAccountData);
    let tokenSymbols = [], tokenContracts = [], symbolBalances = [];

    tokens.forEach((token) => {
      tokenSymbols.push(token.name);
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

    tokenSymbols.forEach((tokenSymbol, index) => {
      symbolBalances[tokenSymbol] = balances[index];
    });

    yield put(accountAction.setBalances(symbolBalances));
  } catch (e) {
    console.log(e);
  }

  yield put(accountAction.setBalanceLoading(false));
}

export default function* accountWatcher() {
  yield takeLatest(accountAction.accountActionTypes.CONNECT_TO_SCATTER, connectToScatter);
}
