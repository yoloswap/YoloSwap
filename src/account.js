import {eosFromPrivateKey} from './services/eos_factory.js';
import {chains} from './constants.js';

// TODO: here we should have all logic to handle account initilization
var account = {
  account: 'victoratyolo',
  eos: eosFromPrivateKey("5KUgDAHQT9waVxVjZHqaNrv5FTSJ39Xjzthkk4H9ud6mmuGhEis", chains.jungle)
}
// var account = {
//   account: 'testalicaaaa',
//   eos: eosFromPrivateKey("5JNgz941jKNDVZvki6qbMp7t8UKFaop35fqjo88dyAKTbbPg1LC", chains.jungle)
// }

export {account};
