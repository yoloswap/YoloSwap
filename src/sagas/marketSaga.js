import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRates } from "../services/network_service";
import * as marketActions from "../actions/marketAction";
import * as tokenActions from "../actions/tokenAction";
import { MARKET_RATE_FETCHING_INTERVAL } from "../config/app";
import { NETWORK_ACCOUNT } from "../config/env";
import { EOS_TOKEN } from "../config/tokens";
import { callFetchMarketRates } from "../services/api_service";
import { getUSDRateById } from "../services/coingecko_service";

const getTokens = state => state.token.tokens;
const getAccountState = state => state.account;

function* fetchMarketRatesChannel() {
  yield call(fetchMarketRates);

  while (true) {
    yield call(fetchMarketRates, true);
  }
}

function* fetchMarketRates(isBackgroundLoading = false) {
  yield call(setLoading, true, isBackgroundLoading);

  try {
    let tokensWithRate = yield call(getTokensWithRateFromAPI);

    if (!tokensWithRate) {
      tokensWithRate = yield call(getTokensWithRateFromBlockChain);
    }

    yield put(tokenActions.setTokens(tokensWithRate));
  } catch (e) {
    console.log(e);
  }

  yield call(setLoading, false, isBackgroundLoading);

  yield call(delay, MARKET_RATE_FETCHING_INTERVAL);
}

function* getTokensWithRateFromAPI() {
  let tokens = yield select(getTokens);
  let marketRateData;

  try {
    marketRateData = yield call(callFetchMarketRates);
  } catch (e) {
    return false;
  }

  if (!marketRateData.length) {
    return false;
  }

  return tokens.map((token, index) => {
    if (token.symbol === EOS_TOKEN.symbol) {
      return token;
    }

    const tokenMarketRate = marketRateData[index - 1];

    token.sellRate = tokenMarketRate.sellRate;
    token.buyRate = tokenMarketRate.buyRate;
    token.sellRateUsd = tokenMarketRate.sellRateUsd;
    token.buyRateUsd = tokenMarketRate.buyRateUsd;

    return token;
  });
}

function* getTokensWithRateFromBlockChain() {
  let srcSymbols = [], destSymbols = [], srcAmounts = [];
  const account = yield select(getAccountState);
  let tokens = yield select(getTokens);

  tokens.forEach((token) => {
    if (token.symbol === EOS_TOKEN.symbol) {
      return;
    }

    srcSymbols.push(token.symbol);
    destSymbols.push(EOS_TOKEN.symbol);
    srcAmounts.push(1);
  });

  let sellRates = yield call(getRates, getMarketRateParams(account.eos, srcSymbols, destSymbols, srcAmounts));
  let buyRates = yield call(getRates, getMarketRateParams(account.eos, destSymbols, srcSymbols, srcAmounts));
  const coinGeckoResponse = yield call(getUSDRateById, EOS_TOKEN.id);

  const eosUSDPrice = coinGeckoResponse[0] && coinGeckoResponse[0].current_price ? coinGeckoResponse[0].current_price : 0;
  tokens = yield select(getTokens);

  return tokens.map((token, index) => {
    if (token.symbol === EOS_TOKEN.symbol) {
      return token;
    }

    const sellRate = sellRates[index - 1];
    const buyRate = buyRates[index - 1] ? 1 / buyRates[index - 1] : 0;

    token.sellRate = sellRate;
    token.buyRate = buyRate;
    token.sellRateUsd = eosUSDPrice * sellRate;
    token.buyRateUsd = eosUSDPrice * buyRate;

    return token;
  });
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

function* setLoading(isLoading, isBackgroundLoading = false) {
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
