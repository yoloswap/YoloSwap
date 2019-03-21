import { COINGECKO_URL } from "../config/env";

export function getUSDRateById(tokenId) {
  const coinGeckoUrlForUSDRate = COINGECKO_URL + `coins/markets?vs_currency=usd&ids=${tokenId}`;

  return fetch(coinGeckoUrlForUSDRate).then(function (response) {
    return response.json();
  });
}
