import { formatNumberWithZeroDigit } from "../../src/utils/helpers";
import appConfig from "../../src/config/app";
import { getAllRates, getTokenPairRate } from "../services/eosService";
import envConfig from "../../src/config/env";
import { getAPIFReturnFormat, findTokenBySymbol, findTokenById } from "../utils/helpers";
import { validateGetRateParams } from "../utils/validators";
import { fetchTokensByIds } from "../../src/services/coingecko_service";

export async function fetchMarketRates(tokenIds, srcSymbols, tokenRates) {
  try {
    const usdBasedTokens = await fetchTokensByIds(tokenIds);
    const eosBasedTokens = await fetchTokensByIds(tokenIds, envConfig.EOS.id);
    const eosData = findTokenById(usdBasedTokens, envConfig.EOS.id);
    const eosUSDPrice = eosData && eosData.current_price ? eosData.current_price : 0;

    let marketRates = [];

    srcSymbols.forEach((tokenSymbol, index) => {
      const token = findTokenBySymbol(tokenRates, tokenSymbol);

      if (!token) return;

      const sellRate = token.sellRate ? token.sellRate : 0;
      const buyRate = token.buyRate ? 1 / token.buyRate : 0;
      const tokenId = tokenIds[index + 1];
      const usdBasedToken = findTokenById(usdBasedTokens, tokenId);
      const eosBasedToken = findTokenById(eosBasedTokens, tokenId);

      marketRates.push({
        id: tokenId,
        token: tokenSymbol,
        sellRate: sellRate,
        buyRate: buyRate,
        sellRateUsd: sellRate * eosUSDPrice,
        buyRateUsd: buyRate * eosUSDPrice,
        usdChangePercentage: getChangePercentage(usdBasedToken),
        eosChangePercentage: getChangePercentage(eosBasedToken),
      });
    });

    return marketRates;
  } catch(e) {
    console.log(e);
    return [];
  }
}

export async function fetchTokenPairRate(eos, tokenRates, srcSymbol, destSymbol, srcAmount) {
  const srcToken = findTokenBySymbol(envConfig.TOKENS, srcSymbol);
  const destToken = findTokenBySymbol(envConfig.TOKENS, destSymbol);
  const error = validateGetRateParams(srcSymbol, destSymbol, srcToken, destToken, srcAmount);

  if (error) {
    return getAPIFReturnFormat(0, 400, error);
  }

  try {
    let rate = srcAmount;

    if (srcSymbol !== destSymbol) {
      if (+srcAmount !== appConfig.DEFAULT_RATE_AMOUNT) {
        rate = await getTokenPairRate(eos, srcSymbol, destSymbol, srcAmount, srcToken.precision, destToken.precision);
      } else {
        const isBuy = srcSymbol === envConfig.EOS.symbol;
        const tokenSymbol = isBuy ? destSymbol : srcSymbol;
        const token = findTokenBySymbol(tokenRates, tokenSymbol);
        rate = isBuy ? token.buyRate : token.sellRate;
      }

      if (!rate) {
        return getAPIFReturnFormat(0, 400, 'Our reserves cannot handle your amount at the moment. Please try again later');
      }
    }

    return getAPIFReturnFormat(formatNumberWithZeroDigit(rate));
  } catch (e) {
    return getAPIFReturnFormat(0, 500, 'There is something wrong with the API');
  }
}

export async function fetchTokenRates(eos, srcSymbols, destSymbols, srcAmounts, srcPrecisions, destPrecisions) {
  try {
    const sellRates = await getAllRates(eos, srcSymbols, destSymbols, srcAmounts, srcPrecisions, destPrecisions);
    const buyRates = await getAllRates(eos, destSymbols, srcSymbols, srcAmounts, destPrecisions, srcPrecisions);
    let tokenRates = [];

    srcSymbols.forEach((tokenSymbol, index) => {
      const sellRate = sellRates[index];
      const buyRate = buyRates[index];

      tokenRates.push({
        symbol: tokenSymbol,
        sellRate: sellRate,
        buyRate: buyRate,
      });
    });

    return tokenRates;
  } catch(e) {
    console.log(e);
    return [];
  }
}

function getChangePercentage(tokenData) {
  return tokenData && tokenData.price_change_percentage_24h ? tokenData.price_change_percentage_24h: 0;
}
