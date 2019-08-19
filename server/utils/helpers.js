import * as _ from "underscore";

export function getAPIFReturnFormat(data, statusCode = 200, message = 'Success') {
  if (statusCode !== 200) {
    return { status: { code: statusCode, message: message } }
  }

  return {
    status: { code: statusCode, message: message },
    data: data
  }
}

export function findTokenById(tokens, tokenId) {
  return _.find(tokens, (token) => { return token.id === tokenId });
}

export function findTokenBySymbol(tokens, tokenSymbol) {
  return _.find(tokens, (token) => { return token.symbol === tokenSymbol });
}
