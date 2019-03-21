import Eos from 'eosjs';
import cors from 'cors';
import express from 'express';
import { getRates } from "../src/services/network_service";
import { NETWORK_ACCOUNT, NETWORK_CHAIN_ID, NETWORK_HOST } from "../src/config/env";
import { EOS_TOKEN, TOKENS } from "../src/config/tokens";
import { getUSDRateById } from "../src/services/coingecko_service";
const app = express();
const port = 3002;
const rateFetchingInterval = 10000;
const eos = Eos({
  httpEndpoint: 'https://' + NETWORK_HOST,
  chainId: NETWORK_CHAIN_ID,
});
let rates = [], srcAmounts = [], srcSymbols = [], destSymbols = [];

TOKENS.forEach((token) => {
  if (token.symbol === EOS_TOKEN.symbol) {
    return;
  }

  srcSymbols.push(token.symbol);
  destSymbols.push(EOS_TOKEN.symbol);
  srcAmounts.push(1);
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
    const coinGeckoResponse = await getUSDRateById(EOS_TOKEN.id);
    const eosUSDPrice = coinGeckoResponse[0] && coinGeckoResponse[0].current_price ? coinGeckoResponse[0].current_price : 0;
    let tokenRates = [];

    srcSymbols.forEach((tokenSymbol, index) => {
      const sellRate = sellRates[index];
      const buyRate = buyRates[index] ? 1 / buyRates[index] : 0;

      tokenRates.push({
        token: tokenSymbol,
        sellRate: sellRate,
        buyRate: buyRate,
        sellRateUsd: sellRate * eosUSDPrice,
        buyRateUsd: buyRate * eosUSDPrice
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
    networkAccount: NETWORK_ACCOUNT,
    eosTokenAccount: EOS_TOKEN.account,
  }
}

app.listen(port, () => console.log(`Server's listening on port ${port}`));
