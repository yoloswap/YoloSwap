import envConfig from "../../src/config/env";
import Eos from "eosjs";
import { getRate } from "../../src/services/network_service";

export async function getTokenPairRate(eos, srcSymbol, destSymbol, srcAmount) {
  return await callEosServiceWithBackupNode(getRate, createRateParams(eos, srcSymbol, destSymbol, srcAmount));
}

export async function getAllRates(eos, srcSymbols, destSymbols, srcAmounts) {
  let rates = [];

  for (let i = 0; i < srcSymbols.length; i++) {
    const rate = await getTokenPairRate(eos, srcSymbols[i], destSymbols[i], srcAmounts[i]);
    rates.push(rate)
  }

  return rates
}

export async function callEosServiceWithBackupNode(serviceFunction, params, defaultValue = 0, attempt = 0) {
  let result = defaultValue;

  if (attempt >= envConfig.NETWORK_HOSTS.length) return result;

  try {
    result = await serviceFunction(params);
  } catch (e) {
    ++attempt;
    params.eos = getEOSInstance(attempt);
    result = await callEosServiceWithBackupNode(serviceFunction, params, defaultValue, attempt);
  }

  return result;
}

export function getEOSInstance(attempt = 0) {
  return Eos({
    httpEndpoint: 'https://' + envConfig.NETWORK_HOSTS[attempt],
    chainId: envConfig.NETWORK_CHAIN_ID,
  });
}

function createRateParams(eos, srcSymbol, destSymbol, srcAmount) {
  return {
    eos: eos,
    srcSymbol: srcSymbol,
    destSymbol: destSymbol,
    srcAmount: srcAmount,
    networkAccount: envConfig.NETWORK_ACCOUNT,
    eosTokenAccount: envConfig.EOS.account,
  }
}
