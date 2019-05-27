const envConfig = {
  NETWORK_BLOCKCHAIN: 'eos',
  NETWORK_PROTOCOL: 'https',
  NETWORK_PORT: '443',
  NETWORK_ACCOUNT: 'yolonetworkx',
  NETWORK_HOST: 'mainnet.eoscanada.com',
  NETWORK_CHAIN_ID: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  TX_URL: 'https://bloks.io/transaction/',
  COINGECKO_URL: 'https://api.coingecko.com/api/v3/',
  API_URL: 'https://api.yoloswap.com/',
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
    "id": "everipedia",
    "name": "Everipedia",
    "symbol": "IQ",
    "account": "everipediaiq",
    "precision": 3,
    "logo": "iq.png",
  },
  {
    "id": "infiniverse",
    "name": "Infiniverse",
    "symbol": "INF",
    "account": "infinicoinio",
    "precision": 4,
    "logo": "inf.png",
  },
  {
    "id": "paytomat",
    "name": "Paytomat",
    "symbol": "PTI",
    "account": "ptitokenhome",
    "precision": 4,
    "logo": "pti.png",
    "listingTime": "5-17-2019"
  },
  {
    "id": "aeron",
    "name": "Aeron",
    "symbol": "ARN",
    "account": "aeronaerozzz",
    "precision": 8,
    "logo": "arn.png",
  },
  {
    "id": "emanate",
    "name": "Emanate",
    "symbol": "EMT",
    "account": "emanateoneos",
    "precision": 4,
    "logo": "emt.png",
  },
  {
    "id": "bancor",
    "name": "Bancor Network",
    "symbol": "BNT",
    "account": "bntbntbntbnt",
    "precision": 10,
    "logo": "bnt.svg",
  },
  {
    "id": "chintai",
    "name": "Chintai",
    "symbol": "CHEX",
    "account": "chexchexchex",
    "precision": 8,
    "logo": "chex.png",
  },
];

export default envConfig;
