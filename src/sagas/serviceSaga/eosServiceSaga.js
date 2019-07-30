import { call, put } from 'redux-saga/effects';
import * as accountActions from "../../actions/accountAction";
import envConfig from "../../config/env";
import * as scatterService from "../../services/scatter_service";
import { trade, getRate, getBalances } from "../../services/network_service";

export function* tokenTrade(params) {
  return yield call(trade, {
    eos: params.eos,
    networkAccount: envConfig.NETWORK_ACCOUNT,
    userAccount: params.userAccount,
    srcAmount: params.srcAmount,
    srcTokenAccount: params.srcTokenAccount,
    destTokenAccount: params.destTokenAccount,
    srcSymbol: params.srcSymbol,
    destPrecision: params.destPrecision,
    destSymbol: params.destSymbol,
    minConversionRate: params.minConversionRate,
  });
}

export function* getTokenBalances(eos, reserveAccount, tokenSymbols, tokenContracts) {
  return yield call(callEosServiceWithBackupNode, getBalances, { eos, reserveAccount, tokenSymbols, tokenContracts }, []);
}

export function* getTokenPairRate(eos, srcSymbol, destSymbol, srcAmount, srcPrecision, destPrecision) {
  return yield call(callEosServiceWithBackupNode,
    getRate,
    createRateParams(eos, srcSymbol, destSymbol, srcAmount, srcPrecision, destPrecision)
  );
}

export function* getAllRates(eos, srcSymbols, destSymbols, srcAmounts, srcPrecisions, destPrecisions) {
  let rates = [];

  for (let i = 0; i < srcSymbols.length; i++) {
    const rate = yield call(getTokenPairRate, eos, srcSymbols[i], destSymbols[i], srcAmounts[i], srcPrecisions[i], destPrecisions[i]);
    rates.push(rate)
  }

  return rates
}

export function* callEosServiceWithBackupNode(serviceFunction, params, defaultValue = 0, attempt = 0) {
  let result = defaultValue;

  if (attempt >= envConfig.NETWORK_HOSTS.length) return result;

  try {
    result = yield call(serviceFunction, params);
  } catch (e) {
    ++attempt;
    params.eos = getBackupEOSNode(attempt);
    yield put(accountActions.setScatterEos(params.eos));
    result = yield call(callEosServiceWithBackupNode, serviceFunction, params, defaultValue, attempt);
  }

  return result;
}

function getBackupEOSNode(attempt) {
  const scatterJs = scatterService.initiateScatter();
  return scatterService.getEosInstance(scatterJs.scatter, envConfig.NETWORK_HOSTS[attempt]);
}

function createRateParams(eos, srcSymbol, destSymbol, srcAmount, srcPrecision, destPrecision) {
  return {
    eos,
    srcSymbol,
    destSymbol,
    srcAmount,
    srcPrecision,
    destPrecision,
    networkAccount: envConfig.NETWORK_ACCOUNT,
    eosTokenAccount: envConfig.EOS.account
  };
}
