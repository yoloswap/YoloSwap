import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRate, trade } from "../services/network_service";
import * as swapActions from "../actions/swapAction";
import * as accountActions from "../actions/accountAction";
import { NETWORK_ACCOUNT } from "../config/env";
import { EOS_TOKEN } from "../config/tokens";
import { MAX_DEST_AMOUNT, MIN_CONVERSION_RATE } from "../config/app";

const getTokens = state => state.token.tokens;
const getSwapState = state => state.swap;
const getAccountState = state => state.account;

function* swapToken() {
  const tokens = yield select(getTokens);
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);

  yield put(accountActions.setScatterConfirmLoading(true));

  const sourceAmount = (+swap.sourceAmount).toFixed(4);
  const sourceToken = tokens.find((item) => swap.sourceToken === item.name);
  const destToken = tokens.find((item) => swap.destToken === item.name);

  try {
    const result = yield call(
      trade,
      {
        eos: account.eos,
        networkAccount: NETWORK_ACCOUNT,
        userAccount: account.account.name,
        userAuthority: account.account.authority,
        srcAmount: sourceAmount,
        srcPrecision: sourceToken.precision,
        srcTokenAccount: sourceToken.account,
        srcSymbol: sourceToken.name,
        destPrecision: destToken.precision,
        destSymbol: destToken.name,
        destTokenAccount: destToken.account,
        destAccount: account.account.name,
        maxDestAmount: MAX_DEST_AMOUNT,
        minConversionRate: MIN_CONVERSION_RATE,
        walletId: account.account.name,
        hint: ""
      }
    );

    console.log(result);
  } catch (e) {
    console.log(e);
  }

  yield put(accountActions.setScatterConfirmLoading(false));
}

function* fetchTokenPairRate() {
  const swap = yield select(getSwapState);

  if (swap.sourceToken === swap.destToken) {
    yield put(swapActions.setTokenPairRate(1));
    yield put(swapActions.setDestAmount(swap.sourceAmount));
    return;
  }

  yield put(swapActions.setTokenPairRateLoading(true));

  const account = yield select(getAccountState);
  const sourceAmount = swap.sourceAmount ? swap.sourceAmount : 1;

  try {
    const tokenPairRate = yield call(
      getRate,
      getRateParams(account.eos, swap.sourceToken, swap.destToken, sourceAmount)
    );

    if (!tokenPairRate) {
      yield put(swapActions.setError('Your source amount is way too much for us to handle the swap'));
    } else {
      yield put(swapActions.setError(''));
    }

    yield put(swapActions.setDestAmount(tokenPairRate * sourceAmount));
    yield put(swapActions.setTokenPairRate(tokenPairRate));
  } catch (e) {
    console.log(e);
  }

  yield put(swapActions.setTokenPairRateLoading(false));
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

export default function* swapWatcher() {
  yield takeLatest(swapActions.swapActionTypes.SWAP_TOKEN, swapToken);
  yield takeLatest(swapActions.swapActionTypes.FETCH_TOKEN_PAIR_RATE, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_DEST_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_AMOUNT, fetchTokenPairRate);
}
