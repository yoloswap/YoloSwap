import { getRate as getRateReserve } from './reserve_service';

async function getBalances(options){
  let eos = options.eos
  let reserveAccount = options.reserveAccount
  let tokenSymbols = options.tokenSymbols
  let tokenContracts = options.tokenContracts

  let balances = []
  let arrayLength = tokenSymbols.length;
  for (var i = 0; i < arrayLength; i++) {
    let balanceRes = await eos.getCurrencyBalance({
      code: tokenContracts[i],
      account: reserveAccount,
      symbol: tokenSymbols[i]}
    )
    balances.push(parseFloat(balanceRes[0]) || 0)
  }
  return balances
}

async function getRate(options) {
  const eos = options.eos
  const srcSymbol = options.srcSymbol
  const destSymbol = options.destSymbol
  const srcAmount = options.srcAmount
  const networkAccount = options.networkAccount
  const eosTokenAccount = options.eosTokenAccount

  let reservesReply = await eos.getTableRows({
    code: networkAccount,
    scope:networkAccount,
    table:"reservespert",
    json: true
  })
  let bestRate = 0
  let tokenSymbol = (srcSymbol === "EOS" ? destSymbol : srcSymbol)
  for (var t = 0; t < reservesReply.rows.length; t++) {
    if (tokenSymbol === reservesReply.rows[t].symbol.split(",")[1]) {
      for (var i = 0; i < reservesReply.rows[t].reserve_contracts.length; i++) {
        const reserveName = reservesReply.rows[t].reserve_contracts[i];
        const currentRate = await getRateReserve({
          eos:eos,
          reserveAccount:reserveName,
          eosTokenAccount:eosTokenAccount,
          srcSymbol:srcSymbol,
          destSymbol:destSymbol,
          srcAmount:srcAmount
        })
        if(currentRate > bestRate) {
          bestRate = currentRate
        }
      }
      break;
    }
  }

  return bestRate
}

async function getRates(options) {
    // TODO: missing slippageRate handling

  const eos = options.eos
  const srcSymbols = options.srcSymbols
  const destSymbols = options.destSymbols
  const srcAmounts = options.srcAmounts
  const networkAccount = options.networkAccount
  const eosTokenAccount = options.eosTokenAccount

  let arrayLength = srcSymbols.length
  let ratesArray = []
  for (var i = 0; i < arrayLength; i++) {
    const rate = await getRate({
      eos:eos,
      srcSymbol:srcSymbols[i],
      destSymbol:destSymbols[i],
      srcAmount:srcAmounts[i],
      networkAccount:networkAccount,
      eosTokenAccount:eosTokenAccount
    })
    ratesArray.push(rate)
  }
  return ratesArray
}

async function trade(options) {
  let eos = options.eos
  let networkAccount = options.networkAccount
  let userAccount = options.userAccount
  let srcAmount = options.srcAmount
  let srcTokenAccount = options.srcTokenAccount
  let destTokenAccount = options.destTokenAccount
  let srcSymbol = options.srcSymbol
  let destPrecision = options.destPrecision
  let destSymbol = options.destSymbol
  let minConversionRate = options.minConversionRate

  let memo = `${destPrecision} ${destSymbol},${destTokenAccount},${minConversionRate}`
  let asset = `${srcAmount} ${srcSymbol}`

  const token = await eos.contract(srcTokenAccount);

  return await token.transfer(
    { from: userAccount, to: networkAccount, quantity: asset, memo: memo },
    { authorization: [`${userAccount}@active`]}
  );
}

export {getBalances, getRate, getRates, trade};
