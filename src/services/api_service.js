import { API_URL } from "../config/env";

export function callFetchMarketRates() {
  return fetch(`${API_URL}fetchMarketRates`).then(function (response) {
    return response.json();
  });
}
