import * as dfuseService from "../services/dfuseService";
import envConfig from "../../src/config/env";
import { findTokenBySymbol } from "../utils/helpers";

export async function fetch24hVolume(dfuseAuthToken, srcSymbols, tokenRates) {
  try {
    if (!tokenRates.length) { return [] }

    const volumes = await dfuseService.get24hVolume(dfuseAuthToken['token'], envConfig.NETWORK_ACCOUNT);
    const formattedVolumes = [];

    srcSymbols.forEach(symbol => {
      const tokenRate = findTokenBySymbol(tokenRates, symbol);
      const token = findTokenBySymbol(envConfig.TOKENS, symbol);

      formattedVolumes.push({
        token: symbol,
        lastPrice: tokenRate.sellRate,
        eosVolume: volumes[symbol].eos,
        usdVolume: volumes[symbol].tokens,
        contractName: token.account
      });
    });

    return formattedVolumes;
  } catch (e) {
    console.log(e);
    return [];
  }
}
