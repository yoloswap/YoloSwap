import ScatterJS from "scatterjs-core";
import Eos from "eosjs";
import ScatterEOS from "scatterjs-plugin-eosjs";
import envConfig from "../config/env";

export async function connect(isIdentityNeeded = true) {
  const scatter = initiateScatter();
  const network = getNetworkObject();

  const connected = await scatter.connect('yolo');

  if(!connected) return false;

  window.ScatterJS = null;

  if (!scatter.identity && !isIdentityNeeded) {
    return;
  }

  const requiredFields = { accounts:[network] };
  await scatter.getIdentity(requiredFields);

  const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
  const eos = getEosInstance(scatter, network);

  return { account, eos }
}

export async function disconnect() {
  const scatter = initiateScatter();

  scatter.forgetIdentity();
}

export function initiateScatter() {
  ScatterJS.plugins(new ScatterEOS());

  return ScatterJS.scatter;
}

export function getEosInstance(scatter, network = null) {
  network = network ? network : getNetworkObject();

  return scatter.eos(network, Eos, {});
}

function getNetworkObject() {
  return {
    blockchain: envConfig.NETWORK_BLOCKCHAIN,
    protocol: envConfig.NETWORK_PROTOCOL,
    host: envConfig.NETWORK_HOST,
    port: envConfig.NETWORK_PORT,
    chainId: envConfig.NETWORK_CHAIN_ID
  }
}
