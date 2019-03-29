import envConfig from "../config/env";

export function callFetchMarketRates() {
  return fetch(`${envConfig.API_URL}fetchMarketRates`).then(function (response) {
    return response.json();
  });
}
