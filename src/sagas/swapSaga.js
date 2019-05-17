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
  yield put(swapActions.setFluctuatingRate(0));

  const swap = yield select(getSwapState);
  const account = yield select(getAccountState);
  const sourceAmount = swap.sourceAmount ? swap.sourceAmount : appConfig.DEFAULT_RATE_AMOUNT;
  const isValidInput = yield call(validateInputParams);

  if (!isValidInput) return;

  yield put(swapActions.setTokenPairRateLoading(true));

  try {
    const tokenPairRate = yield call(
      getRate,
      getRateParams(account.eos, swap.sourceToken.symbol, swap.destToken.symbol, sourceAmount)
    );

    const destAmount = formatAmount(tokenPairRate * sourceAmount, swap.destToken.precision);
    let error = validateRateResult(tokenPairRate, swap.sourceAmount, destAmount);

    if (!error) {
      yield put(swapActions.setDestAmount(destAmount));
      yield put(swapActions.setTokenPairRate(tokenPairRate));
      yield call(setFluctuatingRate, account.eos, tokenPairRate, swap.sourceToken.symbol, swap.destToken.symbol);
    } else {
      yield put(swapActions.setError(error));
      yield put(swapActions.setDestAmount(0));
      yield put(swapActions.setTokenPairRate(0));
    }
  } catch (e) {
    yield put(swapActions.setError(`This pair is under maintenance. Please try again later`));
    yield put(swapActions.setDestAmount(0));
    yield put(swapActions.setTokenPairRate(0));
    console.log(e);
  }

  yield put(swapActions.setTokenPairRateLoading(false));
}

export function* validateInputParams() {
  const swap = yield select(getSwapState);
  const eosSymbol = envConfig.EOS.symbol;
  const sourceToken = swap.sourceToken;
  const destToken = swap.destToken;
  const sourceAmount = swap.sourceAmount.toString();
  const sourceTokenDecimals = sourceToken.precision;
  const sourceTokenSymbol = sourceToken.symbol;
  const sourceAmountDecimals = sourceAmount.split(".")[1];

  if (sourceTokenSymbol === destToken.symbol) {
    yield call(setError, 'Cannot exchange the same token');
    return false;
  } else if (sourceTokenSymbol !== eosSymbol && destToken.symbol !== eosSymbol) {
    yield call(setError, 'Token to Token Swapping is not yet supported at current version of Yolo. Please choose EOS as either your source or destination input');
    return false;
  } else if (sourceAmountDecimals && sourceAmountDecimals.length > sourceTokenDecimals) {
    yield call(setError, `Your ${sourceTokenSymbol} source amount's decimals should be no longer than ${sourceTokenDecimals} characters`);
    return false;
  } else if (sourceAmount > sourceToken.balance) {
    yield call(setError, 'Your source amount is bigger than your real balance');
  } else if (sourceAmount !== '' && !+sourceAmount) {
    yield call(setError, 'Your source amount is invalid');
    return false;
  } else {
    yield put(swapActions.setError(''));
  }

  return true;
}

function validateRateResult(tokenPairRate, srcAmount, destAmount) {
  let error = false;

  if (!tokenPairRate) {
    error = `Our reserves cannot handle your amount at the moment. Please try again later`;
  } else if (srcAmount > 0 && !destAmount) {
    error = 'Your source amount is too small to make the swap';
  }

  return error;
}

function* setFluctuatingRate(eos, expectedRate, srcTokenSymbol, destTokenSymbol) {
  try {
    const expectedDefaultRate = yield call(getRate, getRateParams(eos, srcTokenSymbol, destTokenSymbol, appConfig.DEFAULT_RATE_AMOUNT));
    let fluctuatingRate = 0;

    if (+expectedRate && +expectedDefaultRate) {
      fluctuatingRate = (expectedDefaultRate - expectedRate) / expectedRate;
      fluctuatingRate = Math.round(fluctuatingRate * 1000) / 10;
      if (fluctuatingRate <= 0.1) fluctuatingRate = 0;

      if (fluctuatingRate === 100) {
        fluctuatingRate = 0;
      }
    }

    yield put(swapActions.setFluctuatingRate(fluctuatingRate));
  } catch (e) {
    console.log(e);
  }
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
