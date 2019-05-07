import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRate, trade } from "../services/network_service";
import * as swapActions from "../actions/swapAction";
import * as accountActions from "../actions/accountAction";
import * as txActions from "../actions/transactionAction";
import { formatAmount } from "../utils/helpers";
import envConfig from "../config/env";
import appConfig from "../config/app";

const getSwapState = state => state.swap;
const getAccountState = state => state.account;

function* swapToken() {
  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);

  const sourceToken = swap.sourceToken;
  const sourceTokenSymbol = sourceToken.symbol;
  const srcAmount = swap.sourceAmount;
  const destToken = swap.destToken;
  const destSymbol = destToken.symbol;
  const destAmount = swap.destAmount;
  const sourceAmountWithFullDecimals = (+srcAmount).toFixed(sourceToken.precision);
  const minConversionRate = swap.tokenPairRate - (swap.tokenPairRate * appConfig.MIN_CONVERSION_RATE);

  try {
    yield put(txActions.setTxConfirming(true));

    const result = yield call(
      trade,
      {
        eos: account.eos,
        networkAccount: envConfig.NETWORK_ACCOUNT,
        userAccount: account.account.name,
        srcAmount: sourceAmountWithFullDecimals,
        srcTokenAccount: sourceToken.account,
        destTokenAccount: destToken.account,
        srcSymbol: sourceTokenSymbol,
        destPrecision: destToken.precision,
        destSymbol: destSymbol,
        minConversionRate: minConversionRate,
      }
    );

    const txHash = result.transaction_id;

    yield put(txActions.setTxConfirming(false));
    yield call(setTxBroadcastingTime);
    yield call(setTxData, txHash, srcAmount, sourceTokenSymbol, destAmount, destSymbol);
    yield put(swapActions.setSourceAmount(''));
    yield put(accountActions.fetchBalance());
    yield call(delay, 5000);
    yield put(txActions.resetTx());
  } catch (e) {
    yield put(txActions.resetTx());

    if (e.message) {
      yield put(txActions.setTxError(e.message));
    } else {
      const error = JSON.parse(e);
      if (error.error.details[0]) {
        yield put(txActions.setTxError(error.message + ": " + error.error.details[0].message));
      } else {
        yield put(txActions.setTxError(error.error.what));
      }
    }

    yield put(accountActions.fetchBalance());
    yield call(delay, 3000);
    yield put(txActions.setTxError(''));
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

function* setTxBroadcastingTime() {
  yield put(txActions.setTxBroadcasting(true));
  yield call(delay, 1000);
  yield put(txActions.setTxBroadcasting(false));
}

function* setTxData(txHash, sourceAmount, sourceSymbol, destAmount, destSymbol) {
  yield put(txActions.setTxHash(txHash));
  yield put(txActions.addTxDataToHistory({
    type: 'swap',
    hash: txHash,
    srcAmount: sourceAmount,
    srcSymbol: sourceSymbol,
    destAmount: destAmount,
    destSymbol: destSymbol,
    status: 'executed'
  }));
}

export default function* swapWatcher() {
  yield takeLatest(swapActions.swapActionTypes.SWAP_TOKEN, swapToken);
  yield takeLatest(swapActions.swapActionTypes.FETCH_TOKEN_PAIR_RATE, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_DEST_TOKEN, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_AMOUNT, fetchTokenPairRate);
  yield takeLatest(swapActions.swapActionTypes.SET_SOURCE_AND_DEST_TOKEN, fetchTokenPairRate);
}
