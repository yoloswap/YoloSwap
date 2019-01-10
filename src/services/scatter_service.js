import ScatterJS from "scatterjs-core";
import Eos from "eosjs";
import ScatterEOS from "scatterjs-plugin-eosjs";
import * as env from "../config/env";

export async function connect() {
  const scatter = initiateScatter();
  const network = getNetworkObject();

  const connected = await ScatterJS.scatter.connect('yolo');

  if(!connected) return false;

  window.ScatterJS = null;

  const requiredFields = { accounts:[network] };

  await scatter.getIdentity(requiredFields);

  const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
  const eos = getEosInstance();

  return { account, eos }
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
    blockchain: env.NETWORK_BLOCKCHAIN,
    protocol: env.NETWORK_PROTOCOL,
    host: env.NETWORK_HOST,
    port: env.NETWORK_PORT,
    chainId: env.NETWORK_CHAIN_ID
  }
}
