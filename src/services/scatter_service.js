import ScatterJS from "scatterjs-core";
import Eos, { JsonRpc, Api } from "eosjs";
import ScatterEOS from "scatterjs-plugin-eosjs";
import ScatterLynx from "scatterjs-plugin-lynx";
import envConfig from "../config/env";

export async function connect(firstTimeConnect = false) {
  const scatterJs = initiateScatter();
  const network = getNetworkObject();
  const requiredFields = { accounts:[network] };
  let isConnected = false;

  if (firstTimeConnect) {
    isConnected = await scatterJs.scatter.connect('yolo');
  } else {
    isConnected = await scatterJs.scatter.login(requiredFields);
  }

  if(!isConnected) return false;

  window.ScatterJS = null;

  const scatter = scatterJs.scatter;

  if (!scatter.identity) return;

  await scatter.getIdentity(requiredFields);

  const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
  const eos = getEosInstance(scatterJs, network);

  return { account, eos }
}

export async function disconnect() {
  const scatterJs = initiateScatter();

  scatterJs.scatter.forgetIdentity();
}

export function initiateScatter() {
  ScatterJS.plugins(new ScatterEOS(), new ScatterLynx(Eos || {Api, JsonRpc}));

  return ScatterJS;
}

export function getEosInstance(scatterJs, network = null) {
  network = network ? network : getNetworkObject();

  return scatterJs.eos(network, Eos, {});
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
