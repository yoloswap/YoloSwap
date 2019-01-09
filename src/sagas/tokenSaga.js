import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRates, getRate, trade } from "../services/network_service";
import * as tokenActions from "../actions/tokenAction";
import { NETWORK_ACCOUNT } from "../constants";
import { EOS_TOKEN } from "../Tokens";
import {account} from "../account";

const getTokenList = state => state.token.list;
const getTokenData = state => state.token;
const getAccountData = state => state.account;

function* fetchMarketRates(action) {
  yield put(tokenActions.setMarketLoading(true));

  const { eos, srcSymbols, destSymbols, srcAmounts } = action.payload;

  const sellRates = yield call(getRates, getMarketRateParams(eos, srcSymbols, destSymbols, srcAmounts));
  const buyRates = yield call(getRates, getMarketRateParams(eos, destSymbols, srcSymbols, srcAmounts));

  const tokens = yield select(getTokenList);

  const tokenWithRate = tokens.map((token, index) => {
    return Object.assign({
      ...token,
      sellRate: sellRates[index],
      buyRate: 1 / buyRates[index],
    });
  });

  yield put(tokenActions.setTokens(tokenWithRate));
  yield put(tokenActions.setMarketLoading(false));
}

function* fetchTokenPairRate() {
  const tokenData = yield select(getTokenData);

  if (tokenData.sourceToken === tokenData.destToken) {
    yield put(tokenActions.setTokenPairRate(1));
    return;
  }

  yield put(tokenActions.setTokenPairRateLoading(true));

  const sourceAmount = tokenData.sourceAmount ? tokenData.sourceAmount : 1;
  const accountData = yield select(getAccountData);

  const tokenPairRate = yield call(
    getRate,
    getRateParams(accountData.eos, tokenData.sourceToken, tokenData.destToken, sourceAmount)
  );

  if (!tokenPairRate) {
    yield put(tokenActions.setError('Your source amount is way too much for us to handle the swap'));
  } else {
    yield put(tokenActions.setError(''));
  }

  yield put(tokenActions.setDestAmount(tokenPairRate * sourceAmount));
  yield put(tokenActions.setTokenPairRate(tokenPairRate));
  yield put(tokenActions.setTokenPairRateLoading(false));
}

function* swapToken() {
  const tokenData = yield select(getTokenData);
  const sourceAmount = (+tokenData.sourceAmount).toFixed(4);

  try {
    const result = yield call(
      trade,
      {
        eos: account.eos,
        networkAccount: NETWORK_ACCOUNT,
        userAccount: account.account,
        srcAmount: sourceAmount,
        srcPrecision: 4,
        srcTokenAccount: 'eosio.token',
        srcSymbol: tokenData.sourceToken,
        destPrecision: 4,
        destSymbol: tokenData.destToken,
        destAccount: account.account,
        destTokenAccount: 'testtokeaaaa',
        maxDestAmount: 1000000000,
        minConversionRate: "0.00000000000001",
        walletId: account.account,
        hint: ""
      }
    );

    const txId = result.transaction_id;
    console.log(txId);
  } catch (e) {
    // console.log(JSON.parse(e).error.details[0].message);
    console.log(e);
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
