import Eos from 'eosjs';
import cors from 'cors';
import express from 'express';
import { getRates } from "../src/services/network_service";
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
app.get('/fetchMarketRates', fetchMarketRates);

async function fetchMarketRates(req, res) {
  res.send(rates);
}

fetchMarketRatesInterval();
setInterval(fetchMarketRatesInterval, rateFetchingInterval);

async function fetchMarketRatesInterval() {
  try {
    const sellRates = await getRates(createRateParams(srcSymbols, destSymbols));
    const buyRates = await getRates(createRateParams(destSymbols, srcSymbols));
    const coinGeckoTokens = await fetchTokensByIds(tokenIds);
    const eosData = _.find(coinGeckoTokens, (token) => { return token.id === envConfig.EOS.id });
    const eosUSDPrice = eosData && eosData.current_price ? eosData.current_price : 0;
    let tokenRates = [];

    srcSymbols.forEach((tokenSymbol, index) => {
      const sellRate = sellRates[index];
      const buyRate = buyRates[index] ? 1 / buyRates[index] : 0;
      const tokenId = tokenIds[index + 1];
      const tokenData = _.find(coinGeckoTokens, (token) => { return token.id === tokenId });

      tokenRates.push({
        id: tokenId,
        token: tokenSymbol,
        sellRate: sellRate,
        buyRate: buyRate,
        sellRateUsd: sellRate * eosUSDPrice,
        buyRateUsd: buyRate * eosUSDPrice,
        percentChange: tokenData && tokenData.price_change_percentage_24h ? tokenData.price_change_percentage_24h: 0
      });
    });

    rates = tokenRates;
  } catch(e) {
    console.log(e);
  }
}

function createRateParams(srcSymbols, destSymbols) {
  return {
    eos: eos,
    srcSymbols: srcSymbols,
    destSymbols: destSymbols,
    srcAmounts: srcAmounts,
    networkAccount: envConfig.NETWORK_ACCOUNT,
    eosTokenAccount: envConfig.EOS.account,
  }
}

app.listen(port, () => console.log(`Server's listening on port ${port}`));
