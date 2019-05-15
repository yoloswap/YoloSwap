import Eos from 'eosjs';
import cors from 'cors';
import express from 'express';
import { getRate, getRates } from "../src/services/network_service";
import envConfig from "../src/config/env";
import { fetchTokensByIds } from "../src/services/coingecko_service";
import * as _ from 'underscore';

const app = express();
const port = 3002;
const rateFetchingInterval = 10000;
const eos = Eos({
  httpEndpoint: 'https://' + envConfig.NETWORK_HOST,
  chainId: envConfig.NETWORK_CHAIN_ID,
});
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
      rate = await getRate(createRateParams(srcSymbol, destSymbol, srcAmount));

      if (!rate) {
        res.send(getAPIFReturnFormat(0, 400, 'Our reserves cannot handle your amount at the moment. Please try again later'));
        return;
      }
    }

    res.send(getAPIFReturnFormat(rate));
  } catch (e) {
    res.send(getAPIFReturnFormat(0, 500, 'There is something wrong with the API'));
  }
}

async function fetchMarketRatesAPI(req, res) {
  res.send(rates);
}

fetchMarketRatesInterval();
setInterval(fetchMarketRatesInterval, rateFetchingInterval);

async function fetchMarketRatesInterval() {
  try {
    const sellRates = await getRates(createBatchRateParams(srcSymbols, destSymbols));
    const buyRates = await getRates(createBatchRateParams(destSymbols, srcSymbols));
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
  const sourceAmountDecimals = (srcAmount.toString()).split(".")[1];

  if (srcAmount.includes('0x') || isNaN(srcAmount) || srcAmount <= 0) {
    error = `Your source amount is invalid`;
  } else if (!srcSymbol || !destSymbol || !srcAmount) {
    error = `One or more of the required parameters are missing. Please make sure you have srcSymbol, destSymbol and srcAmount`;
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

function createRateParams(srcSymbol, destSymbol, srcAmount) {
  return {
    eos: eos,
    srcSymbol: srcSymbol,
    destSymbol: destSymbol,
    srcAmount: srcAmount,
    networkAccount: envConfig.NETWORK_ACCOUNT,
    eosTokenAccount: envConfig.EOS.account,
  }
}

function createBatchRateParams(srcSymbols, destSymbols) {
  return {
    eos: eos,
    srcSymbols: srcSymbols,
    destSymbols: destSymbols,
    srcAmounts: srcAmounts,
    networkAccount: envConfig.NETWORK_ACCOUNT,
    eosTokenAccount: envConfig.EOS.account,
  }
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

function getAPIFReturnFormat(data, statusCode = 200, message = 'success') {
  if (statusCode !== 200) {
    return { status: { code: statusCode, message: message } }
  }

  return {
    status: { code: statusCode, message: message },
    data: data
  }
}

app.listen(port, () => console.log(`Server's listening on port ${port}`));
