const EOS_TOKEN = {
  'name': 'EOS',
  'account': 'eosio.token',
  'precision': 4
};

const TokensWithEOS = [
  EOS_TOKEN,
  {
    'name': 'SYS',
    'account': 'testtokeaaaa',
    'precision': 4
  },
  {
    'name': 'NTA',
    'account': 'testtokeaaaa',
    'precision': 4
  },
  {
    'name': 'OTA',
    'account': 'testtokeaaaa',
    'precision': 4
  }
];

var Tokens = TokensWithEOS.slice(1);

export {Tokens, EOS_TOKEN, TokensWithEOS};
