import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRate, trade } from "../services/network_service";
import * as swapActions from "../actions/swapAction";
import * as accountActions from "../actions/accountAction";
import { formatAmount } from "../utils/helpers";
import envConfig from "../config/env";
import appConfig from "../config/app";

const getSwapState = state => state.swap;
const getAccountState = state => state.account;

function* swapToken() {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);

  const sourceToken = swap.sourceToken;
  const destToken = swap.destToken;
  const sourceAmount = (+swap.sourceAmount).toFixed(sourceToken.precision);

  try {
    yield put(swapActions.setTxConfirming(true));

    const result = yield call(
      trade,
      {
        eos: account.eos,
        networkAccount: envConfig.NETWORK_ACCOUNT,
        userAccount: account.account.name,
        srcAmount: sourceAmount,
        srcTokenAccount: sourceToken.account,
        destTokenAccount: destToken.account,
        srcSymbol: sourceToken.symbol,
        destPrecision: destToken.precision,
        destSymbol: destToken.symbol,
        destAccount: account.account.name,
        minConversionRate: appConfig.MIN_CONVERSION_RATE,
      }
    );

    yield put(swapActions.setTxConfirming(false));
    yield put(swapActions.setTxBroadcasting(true));
    yield call(delay, 1000);
    yield put(swapActions.setTxBroadcasting(false));
    yield put(swapActions.setTxId(result.transaction_id));
    yield put(swapActions.setSourceAmount(''));
    yield put(accountActions.fetchBalance());
    yield call(delay, 5000);
    yield put(swapActions.resetTx());
  } catch (e) {
    yield put(swapActions.resetTx());

    if (e.message) {
      yield put(swapActions.setTxError(e.message));
    } else {
      const error = JSON.parse(e);
      if (error.error.details[0]) {
        yield put(swapActions.setTxError(error.message + ": " + error.error.details[0].message));
      } else {
        yield put(swapActions.setTxError(error.error.what));
      }
    }

    yield put(accountActions.fetchBalance());
    yield call(delay, 3000);
    yield put(swapActions.setTxError(''));
  }
}

export function* fetchTokenPairRate() {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);
  const sourceAmount = swap.sourceAmount ? swap.sourceAmount : 1;
  const isValidInput = yield call(validateValidInput);

  if (!isValidInput) return;

  yield put(swapActions.setTokenPairRateLoading(true));

  try {
    const tokenPairRate = yield call(
      getRate,
      getRateParams(account.eos, swap.sourceToken.symbol, swap.destToken.symbol, sourceAmount)
    );

    const destAmount = getDestAmount(tokenPairRate, sourceAmount, swap.destToken.precision);

    if (!tokenPairRate) {
      yield put(swapActions.setError(`Our reserves cannot handle your amount at the moment. Please try again later.`));
    } else if (swap.sourceAmount > 0 && !destAmount) {
      yield put(swapActions.setError('Your source amount is too small to make the swap'));
    }

    yield put(swapActions.setDestAmount(destAmount));
    yield put(swapActions.setTokenPairRate(tokenPairRate));
  } catch (e) {
    console.log(e);
  }

  yield put(swapActions.setTokenPairRateLoading(false));
}

export function* validateValidInput() {
  const swap = yield select(getSwapState);
  const sourceToken = swap.sourceToken;
  const sourceAmount = swap.sourceAmount.toString();
  const sourceTokenDecimals = sourceToken.precision;
  const sourceAmountDecimals = sourceAmount.split(".")[1];

  if (swap.sourceToken.symbol === swap.destToken.symbol) {
    yield call(setError, 'Cannot exchange the same token');
    return false;
  } else if (sourceAmountDecimals && sourceAmountDecimals.length > sourceTokenDecimals) {
    yield call(setError, `Your source amount's decimals should be no longer than ${sourceTokenDecimals} characters`);
    return false;
  } else if (sourceAmount > sourceToken.balance) {
    yield call(setError, 'Your source amount is bigger than your real balance');
    return false;
  } else if (sourceAmount !== '' && !+sourceAmount) {
    yield call(setError, 'Your source amount is invalid');
    return false;
  } else {
    yield put(swapActions.setError(''));
  }

  return true;
}

function* setError(errorMessage) {
  yield put(swapActions.setError(errorMessage));
  yield put(swapActions.setTokenPairRateLoading(false));
  yield put(swapActions.setTokenPairRate(0));
  yield put(swapActions.setDestAmount(0));
}

function getRateParams(eos, srcSymbol, destSymbol, srcAmount) {
  return {
    eos: eos,
    srcSymbol: srcSymbol,
    destSymbol: destSymbol,
    srcAmount: srcAmount,
    networkAccount: envConfig.NETWORK_ACCOUNT,
    eosTokenAccount: envConfig.EOS.account
  };
}

function getDestAmount(tokenPairRate, sourceAmount, destTokenPrecision) {
  return formatAmount(tokenPairRate * sourceAmount, destTokenPrecision);
}

export default function* swapWatcher() {
  yield takeLatest(swapActions.swapActionTypes.SWAP_TOKEN, swapToken);
  yield takeLatest(swapActions.swapActionTypes.FETCH_TOKEN_PAIR_RATE, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_DEST_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_AMOUNT, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_AND_DEST_TOKEN, fetchTokenPairRate);
}
