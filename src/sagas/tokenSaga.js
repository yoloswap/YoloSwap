import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRates, getRate, trade } from "../services/network_service";
import * as tokenActions from "../actions/tokenAction";
import { NETWORK_ACCOUNT } from "../config/constants";
import { EOS_TOKEN } from "../config/tokens";

const getTokenState = state => state.token;
const getAccountState = state => state.account;

function* fetchMarketRates() {
  yield put(tokenActions.setMarketLoading(true));

  try {
    let srcSymbols = [], destSymbols = [], srcAmounts = [];
    const token = yield select(getTokenState);
    const account = yield select(getAccountState);
    const defaultSrcAmount = 1;

    token.list.forEach((token) => {
      srcSymbols.push(token.name);
      destSymbols.push(token.marketBasedToken);
      srcAmounts.push(defaultSrcAmount);
    });

    const sellRates = yield call(getRates, getMarketRateParams(account.eos, srcSymbols, destSymbols, srcAmounts));
    const buyRates = yield call(getRates, getMarketRateParams(account.eos, destSymbols, srcSymbols, srcAmounts));

    const tokenWithRate = token.list.map((token, index) => {
      return Object.assign({
        ...token,
        sellRate: sellRates[index],
        buyRate: 1 / buyRates[index],
      });
    });

    yield put(tokenActions.setTokens(tokenWithRate));
  } catch (e) {
    console.log(e);
  }

  yield put(tokenActions.setMarketLoading(false));
}

function* fetchTokenPairRate() {
  yield put(tokenActions.setTokenPairRateLoading(true));

  const tokenData = yield select(getTokenState);

  if (tokenData.sourceToken === tokenData.destToken) {
    yield put(tokenActions.setTokenPairRate(1));
    return;
  }

  const account = yield select(getAccountState);
  const sourceAmount = tokenData.sourceAmount ? tokenData.sourceAmount : 1;

  try {
    const tokenPairRate = yield call(
      getRate,
      getRateParams(account.eos, tokenData.sourceToken, tokenData.destToken, sourceAmount)
    );

    if (!tokenPairRate) {
      yield put(tokenActions.setError('Your source amount is way too much for us to handle the swap'));
    } else {
      yield put(tokenActions.setError(''));
    }

    yield put(tokenActions.setDestAmount(tokenPairRate * sourceAmount));
    yield put(tokenActions.setTokenPairRate(tokenPairRate));
  } catch (e) {
    console.log(e);
  }

  yield put(tokenActions.setTokenPairRateLoading(false));
}

function* swapToken() {
  const token = yield select(getTokenState);
  const account = yield select(getAccountState);
  const sourceAmount = (+token.sourceAmount).toFixed(4);

  try {
    const result = yield call(
      trade,
      {
        eos: account.eos,
        networkAccount: NETWORK_ACCOUNT,
        userAccount: account.account.name,
        srcAmount: sourceAmount,
        srcPrecision: 4,
        srcTokenAccount: 'eosio.token',
        srcSymbol: token.sourceToken,
        destPrecision: 4,
        destSymbol: token.destToken,
        destAccount: account.account.name,
        destTokenAccount: 'testtokeaaaa',
        maxDestAmount: 1000000000,
        minConversionRate: "0.00000000000001",
        walletId: account.account.name,
        hint: ""
      }
    );

    const txId = result.transaction_id;
    alert("txId" + txId);
  } catch (e) {
    alert("Error: " + JSON.parse(e).error.details[0].message);
  }
}

function getRateParams(eos, srcSymbol, destSymbol, srcAmount) {
  return {
    eos: eos,
    srcSymbol: srcSymbol,
    destSymbol: destSymbol,
    srcAmount: srcAmount,
    networkAccount: NETWORK_ACCOUNT,
    eosTokenAccount: EOS_TOKEN.account
  };
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

export default function* tokenWatcher() {
  yield takeLatest(tokenActions.tokenActionTypes.FETCH_MARKET_RATES, fetchMarketRates);
  yield takeLatest(tokenActions.tokenActionTypes.FETCH_TOKEN_PAIR_RATE, fetchTokenPairRate);
  yield takeLatest(tokenActions.tokenActionTypes.SWAP_TOKEN, swapToken);
  yield takeLatest(tokenActions.tokenActionTypes.SET_SOURCE_TOKEN, fetchTokenPairRate);
  yield takeLatest(tokenActions.tokenActionTypes.SET_DEST_TOKEN, fetchTokenPairRate);
  yield takeLatest(tokenActions.tokenActionTypes.SET_SOURCE_AMOUNT, fetchTokenPairRate);
}
