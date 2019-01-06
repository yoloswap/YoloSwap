import {eosFromPrivateKey} from './services/eos_factory.js';
import {chains} from './constants.js';

// TODO: here we should have all logic to handle account initilization
var account = {
  account: 'victoratyolo',
  eos: eosFromPrivateKey("5KUgDAHQT9waVxVjZHqaNrv5FTSJ39Xjzthkk4H9ud6mmuGhEis", chains.jungle)
}

export {account};
