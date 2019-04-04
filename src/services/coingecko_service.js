import envConfig from "../config/env";

export function fetchTokensByIds(tokenIds) {
  const coinGeckoUrlForUSDRate = envConfig.COINGECKO_URL + `coins/markets?vs_currency=usd&ids=${tokenIds.join()}`;

  return fetch(coinGeckoUrlForUSDRate).then(function (response) {
    return response.json();
  });
}
