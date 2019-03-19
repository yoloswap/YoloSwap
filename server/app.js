import Eos from 'eosjs';
import express from 'express';
import { getRates } from "../src/services/network_service";
import { NETWORK_ACCOUNT, NETWORK_CHAIN_ID, NETWORK_HOST } from "../src/config/env";
import { EOS_TOKEN, TOKENS } from "../src/config/tokens";

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

// API calls
app.get('/fetchMarketRates', fetchMarketRates);

async function fetchMarketRates(req, res) {
  res.send(rates);
}

// Interval Rate Fetching
fetchMarketRatesInterval();
setInterval(fetchMarketRatesInterval, rateFetchingInterval);

async function fetchMarketRatesInterval() {
  try {
    const sellRates = await getRates(createRateParams(srcSymbols, destSymbols));
    const buyRates = await getRates(createRateParams(destSymbols, srcSymbols));
    let tokenRates = [];

    srcSymbols.forEach((tokenSymbol, index) => {
      tokenRates.push({
        token: tokenSymbol,
        sellRate: sellRates[index],
        buyRate: buyRates[index] ? 1 / buyRates[index] : 0
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
