import cors from 'cors';
import express from 'express';
import envConfig from "../src/config/env";
import { getEOSInstance } from "./services/eosService";
import * as dfuseService from "./services/dfuseService";
import * as rateController from "./controllers/rateController";
import * as volumeController from "./controllers/volumeController";

const app = express();
const port = 3002;
const eos = getEOSInstance();

let tokenRates = [], marketRates = [], srcAmounts = [], srcSymbols = [], destSymbols = [], tokenIds = [],
  srcPrecisions = [], destPrecisions = [], volumes = [], dfuseAuthToken = null;

(function initiateAppData() {
  envConfig.TOKENS.forEach((token) => {
    tokenIds.push(token.id);

    if (token.id !== envConfig.EOS.id) {
      srcSymbols.push(token.symbol);
      destSymbols.push(envConfig.EOS.symbol);
      srcPrecisions.push(token.precision);
      destPrecisions.push(envConfig.EOS.precision);
      srcAmounts.push(1);
    }
  });

  setInterval(async () => {
    marketRates = await rateController.fetchMarketRates(tokenIds, srcSymbols, tokenRates);
  }, 10000);

  setInterval(async () => {
    tokenRates = await rateController.fetchTokenRates(eos, srcSymbols, destSymbols, srcAmounts, srcPrecisions, destPrecisions);
  }, 3000);

  setInterval(async () => {
    dfuseAuthToken = await dfuseService.getAuthToken();
    volumes = await volumeController.fetch24hVolume(dfuseAuthToken, srcSymbols, tokenRates);
  }, 60000);
})();

app.use(cors());
app.get('/fetchMarketRates', getMarketRatesAPI);
app.get('/getRate', getTokenPairRateAPI);
app.get('/get24hVolumes', get24hVolumesAPI);

function getMarketRatesAPI(req, res) {
  res.send(marketRates);
}

async function getTokenPairRateAPI(req, res) {
  const srcSymbol = req.query.srcSymbol;
  const destSymbol = req.query.destSymbol;
  const srcAmount = req.query.srcAmount;
  const result = await rateController.fetchTokenPairRate(eos, tokenRates, srcSymbol, destSymbol, srcAmount);

  res.send(result);
}

function get24hVolumesAPI(req, res) {
  res.send(volumes);
}

app.listen(port, () => console.log(`Server's listening on port ${port}`));
