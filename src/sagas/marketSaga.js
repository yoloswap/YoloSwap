import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRates } from "../services/network_service";
import * as marketActions from "../actions/marketAction";
import * as tokenActions from "../actions/tokenAction";
import { NETWORK_ACCOUNT } from "../config/env";
import { EOS_TOKEN } from "../config/tokens";

const getTokens = state => state.token.tokens;
const getMarketState = state => state.market;
const getAccountState = state => state.account;

function* fetchMarketRates() {
  yield put(marketActions.setLoading(true));

  try {
    let srcSymbols = [], destSymbols = [], srcAmounts = [];
    let tokens = yield select(getTokens);
    const market = yield select(getMarketState);
    const account = yield select(getAccountState);
    const defaultSrcAmount = 1;

    tokens.forEach((token) => {
      srcSymbols.push(token.name);
      destSymbols.push(market.indexToken);
      srcAmounts.push(defaultSrcAmount);
    });

    const sellRates = yield call(getRates, getMarketRateParams(account.eos, srcSymbols, destSymbols, srcAmounts));
    const buyRates = yield call(getRates, getMarketRateParams(account.eos, destSymbols, srcSymbols, srcAmounts));
    tokens = yield select(getTokens);

    const tokensWithRate = tokens.map((token, index) => {
      token.sellRate = sellRates[index];
      token.buyRate = 1 / buyRates[index];
      return token;
    });

    yield put(tokenActions.setTokens(tokensWithRate));
  } catch (e) {
    console.log(e);
  }

  yield put(marketActions.setLoading(false));
}

function getMarketRateParams(eos, srcSymbols, destSymbols, srcAmounts) {
  return {
    eos: eos,
    srcSymbols: srcSymbols,
    destSymbols: destSymbols,
    srcAmounts: srcAmounts,
    networkAccount: NETWORK_ACCOUNT,
    eosTokenAccount: EOS_TOKEN.account
  };
}

export default function* marketWatcher() {
  yield takeLatest(marketActions.marketActionTypes.FETCH_MARKET_RATES, fetchMarketRates);
}