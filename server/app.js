import cors from 'cors';
import express from 'express';
import envConfig from "../src/config/env";
import { fetchTokensByIds } from "../src/services/coingecko_service";
import * as _ from 'underscore';
import { formatNumberWithZeroDigit } from "../src/utils/helpers";
import { getTokenPairRate, getAllRates, getEOSInstance } from "./services/eosService";

const app = express();
const port = 3002;
const rateFetchingInterval = 10000;
const eos = getEOSInstance();
let rates = [], srcAmounts = [], srcSymbols = [], destSymbols = [], tokenIds = [];

envConfig.TOKENS.forEach((token) => {
  tokenIds.push(token.id);

  if (token.id !== envConfig.EOS.id) {
    srcSymbols.push(token.symbol);
    destSymbols.push(envConfig.EOS.symbol);
    srcAmounts.push(1);
  }
});

app.use(cors());
app.get('/fetchMarketRates', fetchMarketRatesAPI);
app.get('/getRate', getRateAPI);

async function getRateAPI(req, res) {
  const srcSymbol = req.query.srcSymbol;
  const destSymbol = req.query.destSymbol;
  const srcAmount = req.query.srcAmount;

  const error = validateGetRateParams(srcSymbol, destSymbol, srcAmount);

  if (error) {
    res.send(getAPIFReturnFormat(0, 400, error));
    return;
  }

  try {
    let rate = srcAmount;

    if (srcSymbol !== destSymbol) {
      rate = await getTokenPairRate(eos, srcSymbol, destSymbol, srcAmount);

      if (!rate) {
        res.send(getAPIFReturnFormat(0, 400, 'Our reserves cannot handle your amount at the moment. Please try again later'));
        return;
      }
    }

    res.send(getAPIFReturnFormat(formatNumberWithZeroDigit(rate)));
  } catch (e) {
    console.log(e);
    res.send(getAPIFReturnFormat(0, 500, 'There is something wrong with the API'));
  }
}

function fetchMarketRatesAPI(req, res) {
  res.send(rates);
}

fetchMarketRatesInterval();
setInterval(fetchMarketRatesInterval, rateFetchingInterval);

async function fetchMarketRatesInterval() {
  try {
    const sellRates = await getAllRates(eos, srcSymbols, destSymbols, srcAmounts);
    const buyRates = await getAllRates(eos, destSymbols, srcSymbols, srcAmounts);

    const usdBasedTokens = await fetchTokensByIds(tokenIds);
    const eosBasedTokens = await fetchTokensByIds(tokenIds, envConfig.EOS.id);
    const eosData = findTokenById(usdBasedTokens, envConfig.EOS.id);
    const eosUSDPrice = eosData && eosData.current_price ? eosData.current_price : 0;
    let tokenRates = [];

    srcSymbols.forEach((tokenSymbol, index) => {
      const sellRate = sellRates[index];
      const buyRate = buyRates[index] ? 1 / buyRates[index] : 0;
      const tokenId = tokenIds[index + 1];
      const usdBasedToken = findTokenById(usdBasedTokens, tokenId);
      const eosBasedToken = findTokenById(eosBasedTokens, tokenId);

      tokenRates.push({
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

    rates = tokenRates;
  } catch(e) {
    console.log(e);
  }
}

function validateGetRateParams(srcSymbol, destSymbol, srcAmount) {
  let error = false;
  const srcToken = findTokenBySymbol(srcSymbol);
  const destToken = findTokenBySymbol(destSymbol);
  const eosSymbol = envConfig.EOS.symbol;
  const sourceAmountDecimals = srcAmount ? (srcAmount.toString()).split(".")[1] : false;

  if (!srcSymbol || !destSymbol || !srcAmount) {
    error = `One or more of the required parameters are missing. Please make sure you have srcSymbol, destSymbol and srcAmount`;
  } else if (srcAmount.includes('0x') || isNaN(srcAmount) || srcAmount <= 0) {
    error = `Your source amount is invalid`;
  } else if (!srcToken) {
    error = `${srcSymbol} is not supported by our API`;
  } else if (!destToken) {
    error = `${destSymbol} is not supported by our API`;
  } else if (srcSymbol !== eosSymbol && destSymbol !== eosSymbol) {
    error = `Token to Token Swapping is not yet supported. Please choose EOS as either your srcSymbol or destSymbol`;
  } else if (sourceAmountDecimals && sourceAmountDecimals.length > srcToken.precision) {
    error = `Your ${srcSymbol} source amount's decimals should be no longer than ${srcToken.precision} characters`;
  }

  return error;
}

function getChangePercentage(tokenData) {
  return tokenData && tokenData.price_change_percentage_24h ? tokenData.price_change_percentage_24h: 0;
}

function findTokenById(tokens, tokenId) {
  return _.find(tokens, (token) => { return token.id === tokenId });
}

function findTokenBySymbol(tokenSymbol) {
  return _.find(envConfig.TOKENS, (token) => { return token.symbol === tokenSymbol });
}

function getAPIFReturnFormat(data, statusCode = 200, message = 'Success') {
  if (statusCode !== 200) {
    return { status: { code: statusCode, message: message } }
  }

  return {
    status: { code: statusCode, message: message },
    data: data
  }
}

app.listen(port, () => console.log(`Server's listening on port ${port}`));
