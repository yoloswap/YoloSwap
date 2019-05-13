import envConfig from "../config/env";

export function fetchTokensByIds(tokenIds, currencyId = 'usd') {
  const coinGeckoUrlForUSDRate = envConfig.COINGECKO_URL + `coins/markets?vs_currency=${currencyId}&ids=${tokenIds.join()}`;

  return fetch(coinGeckoUrlForUSDRate).then(function (response) {
    return response.json();
  });
}
