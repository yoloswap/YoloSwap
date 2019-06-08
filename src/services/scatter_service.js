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
    isConnected = await loginToScatter(scatterJs.scatter, requiredFields);
  }

  if(!isConnected) return false;

  window.ScatterJS = null;

  const scatter = scatterJs.scatter;
  const identity = await scatter.getIdentity(requiredFields);
  const account = identity.accounts.find(x => x.blockchain === 'eos');
  const eos = getEosInstance(scatter);

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

export function getEosInstance(scatter, networkHost = envConfig.NETWORK_HOSTS[0]) {
  const network = getNetworkObject(networkHost);
  const eosOptions = { chainId: envConfig.NETWORK_CHAIN_ID };

  return scatter.eos(network, Eos, eosOptions);
}

function getNetworkObject(networkHost) {
  return {
    blockchain: envConfig.NETWORK_BLOCKCHAIN,
    protocol: envConfig.NETWORK_PROTOCOL,
    host: networkHost,
    port: envConfig.NETWORK_PORT,
    chainId: envConfig.NETWORK_CHAIN_ID
  }
}

async function loginToScatter(scatter, requiredFields) {
  let isConnected = false;

  if (typeof scatter.login === "function") {
    isConnected = await scatter.login(requiredFields);
  }

  return isConnected;
}
