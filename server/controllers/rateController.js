import { formatNumberWithZeroDigit } from "../../src/utils/helpers";
import appConfig from "../../src/config/app";
import { getTokenPairRate } from "../services/eosService";
import envConfig from "../../src/config/env";
import { getAPIFReturnFormat, findTokenBySymbol } from "../utils/helpers";
import { validateGetRateParams } from "../utils/validators";

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

export { getRateAPI }
