import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRates } from "../services/network_service";
import * as marketActions from "../actions/marketAction";
import * as tokenActions from "../actions/tokenAction";
import { MARKET_RATE_FETCHING_INTERVAL } from "../config/app";
import { NETWORK_ACCOUNT } from "../config/env";
import { EOS_TOKEN } from "../config/tokens";

const getTokens = state => state.token.tokens;
const getMarketState = state => state.market;
const getAccountState = state => state.account;

function *fetchMarketRatesChannel() {
  yield call(fetchMarketRates);

  while (true) {
    yield call(fetchMarketRates, true);
  }
}

function *fetchMarketRates(isBackgroundLoading = false) {
  yield call(setLoading, true, isBackgroundLoading);

  try {
    let sameTokenIndex = null;
    let srcSymbols = [], destSymbols = [], srcAmounts = [];
    let tokens = yield select(getTokens);
    const market = yield select(getMarketState);
    const account = yield select(getAccountState);
    const defaultSrcAmount = 1;
    const defaultSellAndBuyRate = 1;

    tokens.forEach((token, index) => {
      if (token.symbol === market.indexToken.symbol) {
        sameTokenIndex = index;
        return;
      }

      srcSymbols.push(token.symbol);
      destSymbols.push(market.indexToken.symbol);
      srcAmounts.push(defaultSrcAmount);
    });

    let sellRates = yield call(getRates, getMarketRateParams(account.eos, srcSymbols, destSymbols, srcAmounts));
    let buyRates = yield call(getRates, getMarketRateParams(account.eos, destSymbols, srcSymbols, srcAmounts));
    tokens = yield select(getTokens);

    if (sameTokenIndex !== null) {
      sellRates.splice(sameTokenIndex, 0, defaultSellAndBuyRate);
      buyRates.splice(sameTokenIndex, 0, defaultSellAndBuyRate);
    }

    const tokensWithRate = tokens.map((token, index) => {
      token.sellRate = sellRates[index];
      token.buyRate = 1 / buyRates[index];
      return token;
    });

    yield put(tokenActions.setTokens(tokensWithRate));
  } catch (e) {
    console.log(e);
  }

  yield call(setLoading, false, isBackgroundLoading);

  yield call(delay, MARKET_RATE_FETCHING_INTERVAL);
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

function *setLoading(isLoading, isBackgroundLoading = false) {
  if (isBackgroundLoading) {
    yield put(marketActions.setBackgroundLoading(isLoading));
  } else {
    yield put(marketActions.setLoading(isLoading));
  }
}

export default function* marketWatcher() {
  yield takeLatest(
    marketActions.marketActionTypes.FETCH_MARKET_RATES, fetchMarketRatesChannel);
}
