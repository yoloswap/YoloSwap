import { getRate as getRateReserve } from './reserve_service';

async function getBalances(options) {
  let eos = options.eos;
  let reserveAccount = options.reserveAccount;
  let tokenSymbols = options.tokenSymbols;
  let tokenContracts = options.tokenContracts;
  let balances = [];
  let arrayLength = tokenSymbols.length;

  for (let i = 0; i < arrayLength; i++) {
    let balanceRes = await eos.getCurrencyBalance({
      code: tokenContracts[i],
      account: reserveAccount,
      symbol: tokenSymbols[i]}
    );

    balances.push(parseFloat(balanceRes[0]) || 0)
  }

  return balances;
}

async function getRate(options) {
  const eos = options.eos;
  const srcSymbol = options.srcSymbol;
  const destSymbol = options.destSymbol;
  const srcAmount = options.srcAmount;
  const networkAccount = options.networkAccount;
  const eosTokenAccount = options.eosTokenAccount;
  const srcPrecision = options.srcPrecision;
  const destPrecision = options.destPrecision;
  const tokenSymbol = (srcSymbol === "EOS" ? destSymbol : srcSymbol);
  const tokenPrecision = (srcSymbol === "EOS" ? destPrecision : srcPrecision);
  const tokenFullSymbol = tokenPrecision + ',' + tokenSymbol;
  const reservesReply = await eos.getTableRows({
    code: networkAccount,
    scope:networkAccount,
    table:"reservespert",
    json: true,
    lower_bound: tokenFullSymbol,
    upper_bound: tokenFullSymbol
  });

  let bestRate = 0;

  for (let t = 0; t < reservesReply.rows.length; t++) {
    if (tokenSymbol === reservesReply.rows[t].symbol.split(",")[1]) {
      for (let i = 0; i < reservesReply.rows[t].reserve_contracts.length; i++) {
        const reserveName = reservesReply.rows[t].reserve_contracts[i];
        const currentRate = await getRateReserve({
          eos:eos,
          reserveAccount:reserveName,
          eosTokenAccount:eosTokenAccount,
          srcSymbol:srcSymbol,
          destSymbol:destSymbol,
          srcAmount:srcAmount
        });

        if(currentRate > bestRate) {
          bestRate = currentRate
        }
      }

      break;
    }
  }

  return bestRate;
}

async function trade(options) {
  let eos = options.eos;
  let networkAccount = options.networkAccount;
  let userAccount = options.userAccount;
  let srcAmount = options.srcAmount;
  let srcTokenAccount = options.srcTokenAccount;
  let destTokenAccount = options.destTokenAccount;
  let srcSymbol = options.srcSymbol;
  let destPrecision = options.destPrecision;
  let destSymbol = options.destSymbol;
  let minConversionRate = options.minConversionRate;

  let memo = getMemo(destPrecision, destSymbol, destTokenAccount, minConversionRate);
  let asset = `${srcAmount} ${srcSymbol}`;

  const token = await eos.contract(srcTokenAccount);

  return await token.transfer(
    { from: userAccount, to: networkAccount, quantity: asset, memo: memo },
    { authorization: [`${userAccount}@active`]}
  );
}

function getMemo(destPrecision, destSymbol, destTokenAccount, minConversionRate) {
  return `${destPrecision} ${destSymbol},${destTokenAccount},${minConversionRate}`;
}

export { getBalances, getRate, getMemo, trade };
