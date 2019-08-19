import cors from 'cors';
import express from 'express';
import envConfig from "../src/config/env";
import appConfig from "../src/config/app";
import { fetchTokensByIds } from "../src/services/coingecko_service";
import * as _ from 'underscore';
import { formatNumberWithZeroDigit } from "../src/utils/helpers";
import { getTokenPairRate, getAllRates, getEOSInstance } from "./services/eosService";
import * as dfuseService from "../src/services/dfuseService";

const app = express();
const port = 3002;
const rateFetchingInterval = 500;
const marketRateFetchingInterval = 10000;
const volumeFetchingInterval = 60000;
const dfuseAuthTokenLife = 1;
const eos = getEOSInstance();

let globalRates = [], globalMarketRates = [], globalSrcAmounts = [],
  globalSrcSymbols = [], globalDestSymbols = [], globalTokenIds = [],
  globalSrcPrecision = [], globalDestPrecision = [];

let globalDfuseToken = null;
let globalVolumes = [];

envConfig.TOKENS.forEach((token) => {
  globalTokenIds.push(token.id);

  if (token.id !== envConfig.EOS.id) {
    globalSrcSymbols.push(token.symbol);
    globalDestSymbols.push(envConfig.EOS.symbol);
    globalSrcPrecision.push(token.precision);
    globalDestPrecision.push(envConfig.EOS.precision);
    globalSrcAmounts.push(1);
  }
});

app.use(cors());
app.get('/fetchMarketRates', fetchMarketRatesAPI);
app.get('/getRate', getRateAPI);
app.get('/getLatestData', getLatestDataAPI);

setInterval(fetchMarketRatesInterval, marketRateFetchingInterval);
setInterval(fetchRatesInterval, rateFetchingInterval);
setInterval(fetchLatestDataInterval, volumeFetchingInterval);

(async function initiateFetchingGlobalValues() {
  fetchMarketRatesInterval();
  await fetchRatesInterval();
  fetchLatestDataInterval();
})();

async function fetchLatestDataInterval() {
  const isExpired = dfuseService.isAuthTokenExpired(globalDfuseToken);

  if (isExpired) {
    globalDfuseToken = await dfuseService.getAuthToken();
  }

  const volumes = await dfuseService.getLastDaysVolume(
    globalDfuseToken['token'],
    envConfig.NETWORK_ACCOUNT,
    dfuseAuthTokenLife
  );

  console.log(globalRates);

  // const formatedVolumes = [];
  //
  // globalSrcSymbols.forEach((symbol, index) => {
  //   formatedVolumes.push({
  //     token: symbol,
  //     lastPrice: sellRate,
  //     '24hVolumeInEos': buyRate,
  //     '24hVolumeInUsd': 1,
  //     contractName: ''
  //   });
  // });
  //
  // globalVolumes = [
  //   {token: 'KARMA', lastPrice: 0.002, '24hVolumeInEos': 0, '24hVolumeInUsd': 0, contractName: "everipediaiq"},
  //   {token: 'HVT', lastPrice: 0.002, '24hVolumeInEos': 0, '24hVolumeInUsd': 0, contractName: "hirevibeshvt"},
  // ];
}

async function getRateAPI(req, res) {
  const srcSymbol = req.query.srcSymbol;
  const destSymbol = req.query.destSymbol;
  const srcAmount = req.query.srcAmount;
  const srcToken = findTokenBySymbol(envConfig.TOKENS, srcSymbol);
  const destToken = findTokenBySymbol(envConfig.TOKENS, destSymbol);
  const error = validateGetRateParams(srcSymbol, destSymbol, srcToken, destToken, srcAmount);

  if (error) {
    res.send(getAPIFReturnFormat(0, 400, error));
    return;
  }

  try {
    let rate = srcAmount;

    if (srcSymbol !== destSymbol) {
      if (+srcAmount !== appConfig.DEFAULT_RATE_AMOUNT) {
        rate = await getTokenPairRate(eos, srcSymbol, destSymbol, srcAmount, srcToken.precision, destToken.precision);
      } else {
        const isBuy = srcSymbol === envConfig.EOS.symbol;
        const tokenSymbol = isBuy ? destSymbol : srcSymbol;
        const token = findTokenBySymbol(globalRates, tokenSymbol);
        rate = isBuy ? token.buyRate : token.sellRate;
      }

      if (!rate) {
        res.send(getAPIFReturnFormat(0, 400, 'Our reserves cannot handle your amount at the moment. Please try again later'));
        return;
      }
    }

    res.send(getAPIFReturnFormat(formatNumberWithZeroDigit(rate)));
  } catch (e) {
    res.send(getAPIFReturnFormat(0, 500, 'There is something wrong with the API'));
  }
}

async function getLatestDataAPI(req, res) {
  res.send(globalVolumes);
}

function fetchMarketRatesAPI(req, res) {
  res.send(globalMarketRates);
}

async function fetchRatesInterval() {
  try {
    const sellRates = await getAllRates(eos, globalSrcSymbols, globalDestSymbols, globalSrcAmounts, globalSrcPrecision, globalDestPrecision);
    const buyRates = await getAllRates(eos, globalDestSymbols, globalSrcSymbols, globalSrcAmounts, globalDestPrecision, globalSrcPrecision);
    let tokenRates = [];

    globalSrcSymbols.forEach((tokenSymbol, index) => {
      const sellRate = sellRates[index];
      const buyRate = buyRates[index];

      tokenRates.push({
        symbol: tokenSymbol,
        sellRate: sellRate,
        buyRate: buyRate,
      });
    });

    globalRates = tokenRates;
  } catch(e) {
    console.log(e);
  }
}

async function fetchMarketRatesInterval() {
  try {
    const usdBasedTokens = await fetchTokensByIds(globalTokenIds);
    const eosBasedTokens = await fetchTokensByIds(globalTokenIds, envConfig.EOS.id);
    const eosData = findTokenById(usdBasedTokens, envConfig.EOS.id);
    const eosUSDPrice = eosData && eosData.current_price ? eosData.current_price : 0;

    let tokenRates = [];

    globalSrcSymbols.forEach((tokenSymbol, index) => {
      const token = findTokenBySymbol(globalRates, tokenSymbol);

      if (!token) return;

      const sellRate = token.sellRate ? token.sellRate : 0;
      const buyRate = token.buyRate ? 1 / token.buyRate : 0;
      const tokenId = globalTokenIds[index + 1];
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

    globalMarketRates = tokenRates;
  } catch(e) {
    console.log(e);
  }
}

function validateGetRateParams(srcSymbol, destSymbol, srcToken, destToken, srcAmount) {
  let error = false;
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

function findTokenBySymbol(tokens, tokenSymbol) {
  return _.find(tokens, (token) => { return token.symbol === tokenSymbol });
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
