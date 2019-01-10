import ScatterJS from "scatterjs-core";
import Eos from "eosjs";
import ScatterEOS from "scatterjs-plugin-eosjs";
import * as constants from "../config/constants";

export async function connect() {
  const scatter = initiateScatter();
  const network = getNetworkObject();

  const connected = await ScatterJS.scatter.connect('yolo');

  if(!connected) return false;

  window.ScatterJS = null;

  const requiredFields = { accounts:[network] };

  await scatter.getIdentity(requiredFields);

  return scatter.identity.accounts.find(x => x.blockchain === 'eos');
}

export function getEosInstance() {
  const scatter = initiateScatter();
  const network = getNetworkObject();

  return scatter.eos(network, Eos, {});
}

function initiateScatter() {
  ScatterJS.plugins(new ScatterEOS());

  return ScatterJS.scatter;
}

function getNetworkObject() {
  return {
    blockchain: constants.NETWORK_BLOCKCHAIN,
    protocol: constants.NETWORK_PROTOCOL,
    host: constants.NETWORK_HOST,
    port: constants.NETWORK_PORT,
    chainId: constants.NETWORK_CHAIN_ID
  }
}
