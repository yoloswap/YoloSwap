const envConfig = {
  NETWORK_BLOCKCHAIN: 'eos',
  NETWORK_PROTOCOL: 'https',
  NETWORK_PORT: '443',
  NETWORK_ACCOUNT: 'yolonetw1121',
  NETWORK_HOST: 'jungle2.cryptolions.io',
  NETWORK_CHAIN_ID: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
  TX_URL: 'https://jungle.bloks.io/transaction/',
  COINGECKO_URL: 'https://api.coingecko.com/api/v3/',
  API_URL: 'http://localhost:3002/',
  EOS: {
    "id": "eos",
    "name": "EOS",
    "symbol": "EOS",
    "account": "eosio.token",
    "precision": 4,
    "logo": "eos.svg",
  },
  USD: {
    "id": "usd",
    "name": "USD",
    "symbol": "USD",
  }
};

envConfig.TOKENS = [
  envConfig.EOS,
  {
    "id": "cryptopix",
    "name": "Crypto Pix",
    "symbol": "PXS",
    "account": "testtokeaaaa",
    "precision": 4,
    "logo": "pxs.svg",
  },
  {
    "id": "everipedia",
    "name": "Everipedia",
    "symbol": "IQ",
    "account": "testtokeaaaa",
    "precision": 3,
    "logo": "iq.png",
  },
  {
    "id": "hirevibes",
    "name": "HireVibes",
    "symbol": "HVT",
    "account": "testtokeaaaa",
    "precision": 4,
    "logo": "hvt.png",
  },
  {
    "id": "karma-coin",
    "name": "Karma",
    "symbol": "KARMA",
    "account": "testtokeaaaa",
    "precision": 4,
    "logo": "karma.png",
  },
  {
    "id": "trybe",
    "name": "Trybe",
    "symbol": "TRYBE",
    "account": "testtokeaaaa",
    "precision": 4,
    "logo": "trybe.svg",
  },
  {
    "id": "eosdac",
    "name": "eosDAC",
    "symbol": "EOSDAC",
    "account": "testtokeaaaa",
    "precision": 4,
    "logo": "eosdac.png",
  },
  {
    "id": "meetone",
    "name": "MeetOne",
    "symbol": "MEETONE",
    "account": "testtokeaaaa",
    "precision": 4,
    "logo": "meetone.png",
  }
];

export default envConfig;
