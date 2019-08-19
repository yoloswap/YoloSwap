import envConfig from "../../src/config/env";

export async function get24hVolume(dfuseKey, networkContract, days = 1) {
  try {
    let current = new Date();
    let past = new Date();
    past.setDate(current.getDate() - days);

    // substract 10 seconds to avoid race condition with dfuse
    current.setSeconds(current.getSeconds() - 10);
    past.setSeconds(past.getSeconds() - 10);

    const currentDate = current.toISOString();
    const pastDate = past.toISOString();

    const currentDateBlockNumber = await fetchBlockByDate(dfuseKey, currentDate);
    const currentBlockNum = currentDateBlockNumber.block.num;

    const pastDateBlockNumber = await fetchBlockByDate(dfuseKey, pastDate);
    const pastBlockNum = pastDateBlockNumber.block.num;

    const currentVolume = await fetchVolume(dfuseKey, currentBlockNum, networkContract);
    const pastVolume = await fetchVolume(dfuseKey, pastBlockNum, networkContract);

    // calculate volume diff per token
    let volumes = {};
    let totalDiffEos = 0;
    const currentTokenDataList = currentVolume.tables[0].rows;
    const pastTokenDataList = pastVolume.tables[0].rows;

    for (let i in currentTokenDataList) {
      const currentTokenData = currentTokenDataList[i];
      const symbol = currentTokenData.json.token_counter.split(" ")[1];
      const currentEos = currentTokenData.json.eos_counter.split(" ")[0];
      const currentTokens = currentTokenData.json.token_counter.split(" ")[0];
      let pastEos = 0;
      let pastTokens = 0;

      for (let j in pastTokenDataList) {
        const pastTokenData = pastTokenDataList[j];

        if (symbol === pastTokenData.json.token_counter.split(" ")[1]) {
          pastEos = pastTokenData.json.eos_counter.split(" ")[0];
          pastTokens = pastTokenData.json.token_counter.split(" ")[0];
        }
      }

      const diffEos = parseFloat(currentEos) - parseFloat(pastEos);
      totalDiffEos += diffEos;

      const diffTokens = parseFloat(currentTokens) - parseFloat(pastTokens);
      volumes[symbol] = {"tokens" : diffTokens, "eos" : diffEos}
    }

    volumes["total_eos"] = totalDiffEos;
    volumes["from"] = currentDate;
    volumes["to"] = pastDate;

    return volumes;
  } catch (e) {
    console.log(e);
    return {};
  }
}

export async function getAuthToken(dfuseAuthToken) {
  const isExpired = isAuthTokenExpired(dfuseAuthToken);

  if (isExpired) {
    return await fetchAuthToken();
  } else {
    return dfuseAuthToken;
  }
}

function isAuthTokenExpired(authToken) {
  if (!authToken) return true;

  let isAuthTokenExpired = false;
  const expiration = authToken["expires_at"];
  const currentTimeStamp = Math.floor(Date.now() / 1000);

  if (currentTimeStamp > expiration) isAuthTokenExpired = true;

  return isAuthTokenExpired;
}

function fetchAuthToken() {
  const dfuseAuthUrl = 'https://auth.dfuse.io/v1/auth/issue';
  const options = {
    method: 'POST',
    body : JSON.stringify({
      'api_key' : envConfig.DFUSE_KEY
    })
  };

  return fetch(dfuseAuthUrl, options).then(function (response) {
    return response.json();
  });
}

function fetchVolume(dfuseKey, blockNum, networkContract) {
  const url = envConfig.DFUSE_URL + `v0/state/tables/accounts?accounts=${networkContract}&scope=${networkContract}&table=tokenstats&json=true&block_num=${blockNum}`;

  return fetch(url, {
    headers: {'Authorization': `Bearer ${dfuseKey}`},
  }).then(function (response) {
    return response.json();
  });
}

function fetchBlockByDate(dfuseKey, date) {
  const url = envConfig.DFUSE_URL + `v0/block_id/by_time?time=${date}&comparator=gte`;

  return fetch(url, {
    headers: {'Authorization': `Bearer ${dfuseKey}`},
  }).then(function (response) {
    return response.json();
  });
}
