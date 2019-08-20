import * as dfuseService from "../services/dfuseService";
import envConfig from "../../src/config/env";
import { findTokenBySymbol } from "../utils/helpers";

export async function fetch24hVolume(dfuseAuthToken, srcSymbols, tokenRates) {
  let formattedVolume = {
    tokenVolumes: [],
    totalEosVolume: 0
  };

  try {
    if (!tokenRates.length) { return formattedVolume }

    const volumes = await dfuseService.get24hVolume(dfuseAuthToken['token'], envConfig.NETWORK_ACCOUNT);
    formattedVolume.totalEosVolume = volumes.total_eos;

    srcSymbols.forEach(symbol => {
      const tokenRate = findTokenBySymbol(tokenRates, symbol);
      const token = findTokenBySymbol(envConfig.TOKENS, symbol);

      formattedVolume.tokenVolumes.push({
        token: symbol,
        lastPrice: tokenRate.sellRate,
        eosVolume: volumes[symbol].eos,
        tokenVolume: volumes[symbol].tokens,
        contractName: token.account
      });
    });
  } catch (e) {
    console.log(e);
  }

  return formattedVolume
}
