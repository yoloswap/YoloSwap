const NETWORK_ACCOUNT = "yolonetw1115";
const NETWORK_BLOCKCHAIN = 'eos';
const NETWORK_PROTOCOL = 'https';
const NETWORK_PORT = '443';
// const NETWORK_HOST = 'mainnet.eoscanada.com';
// const NETWORK_CHAIN_ID = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
const NETWORK_HOST = 'jungle2.cryptolions.io';
const NETWORK_CHAIN_ID = 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473';
const TX_URL = 'https://jungle.bloks.io/transaction/';
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/';

let API_URL = 'http://localhost:3002/';

if (process.env.NODE_ENV === 'production') {
  API_URL = 'https://dev-yolo-backend.knstats.com/';
}

export { NETWORK_ACCOUNT, NETWORK_BLOCKCHAIN, NETWORK_PROTOCOL, NETWORK_PORT, NETWORK_HOST, NETWORK_CHAIN_ID, TX_URL,
  COINGECKO_URL, API_URL }
