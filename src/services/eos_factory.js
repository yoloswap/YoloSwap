import Eos from 'eosjs';

// @param chain: should be a chain object in constant chains, look at constants.js
// @param key: private key
function eosFromPrivateKey(key, chain) {
  return Eos({
   keyProvider: key,
   httpEndpoint: chain.endpoint,
   chain: chain.id
  })
}

export {eosFromPrivateKey};
