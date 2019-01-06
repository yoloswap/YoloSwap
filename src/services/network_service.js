import {getRate as getRateReserve} from './reserve_service';

async function getBalances(options){
    let eos = options.eos
    let account = options.account
    let tokenSymbols = options.tokenSymbols
    let tokenContracts = options.tokenContracts

    let balances = []
    let arrayLength = tokenSymbols.length;
    for (var i = 0; i < arrayLength; i++) {
        let balanceRes = await eos.getCurrencyBalance({
            code: tokenContracts[i],
            account: account,
            symbol: tokenSymbols[i]}
        )
        balances.push(parseFloat(balanceRes[0]) || 0)
    }
    return balances
}

async function getEnabled(options){
    let eos = options.eos
    let networkAccount = options.networkAccount

    let state = await eos.getTableRows({
        code:networkAccount,
        scope:networkAccount,
        table:"state",
        json: true
    })
    return state.rows[0].is_enabled
}

async function getRate(options) {
    // TODO: missing slippageRate calculation and handling

    let eos = options.eos
    let srcSymbol = options.srcSymbol
    let destSymbol = options.destSymbol
    let srcAmount = options.srcAmount
    let networkAccount = options.networkAccount
    let eosTokenAccount = options.eosTokenAccount

    let reservesReply = await eos.getTableRows({
        code: networkAccount,
        scope:networkAccount,
        table:"reservespert",
        json: true
    })

    let bestRate = 0
    let reserveContractsList = reservesReply.rows[0].reserve_contracts
    let arrayLength = reservesReply.rows[0].num_reserves
    for (var i = 0; i < arrayLength; i++) {
        let reserveName = reserveContractsList[i];
        let currentRate = await getRateReserve({
            eos:eos,
            reserveAccount:reserveName,
            eosTokenAccount:eosTokenAccount,
            srcSymbol:srcSymbol,
            destSymbol:destSymbol,
            srcAmount:srcAmount
        })
        // console.log("param - reserveAccount: " + reserveName);
        // console.log("param - eosTokenAccount: " + eosTokenAccount);
        // console.log("param - srcSymbol: " + srcSymbol);
        // console.log("param - destSymbol: " + destSymbol);
        // console.log("param - srcAmount: " + srcAmount);
        // console.log("reserveName: " + reserveName);
        // console.log("currrentRate: " + currentRate);
        if(currentRate > bestRate) {
            bestRate = currentRate
        }
    }
    return bestRate
}

async function getRates(options) {
    // TODO: missing slippageRate handling

    let eos = options.eos
    let srcSymbols = options.srcSymbols
    let destSymbols = options.destSymbols
    let srcAmounts = options.srcAmounts
    let networkAccount = options.networkAccount
    let eosTokenAccount = options.eosTokenAccount

    let arrayLength = srcSymbols.length
    let ratesArray = []
    for (var i = 0; i < arrayLength; i++) {
        let rate = await this.getRate({
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

async function send(options) {
  let eos = options.eos
  let userAccount = options.userAccount
  let toAccount = options.toAccount
  let srcAmount = options.srcAmount
  let srcSymbol = options.srcSymbol
  let asset = `${srcAmount} ${srcSymbol}`
  const result = await eos.transfer({
    from:userAccount,
    to:toAccount,
    quantity:asset,
    memo:""
  });
  return result;
}

async function trade(options) {
    let eos = options.eos
    let networkAccount = options.networkAccount
    let userAccount = options.userAccount 
    let srcAmount = options.srcAmount
    let srcPrecision = options.srcPrecision
    let srcTokenAccount = options.srcTokenAccount
    let srcSymbol = options.srcSymbol
    let destPrecision = options.destPrecision
    let destSymbol = options.destSymbol
    let destTokenAccount = options.destTokenAccount
    let destAccount = options.destAccount
    let maxDestAmount = options.maxDestAmount
    let minConversionRate = options.minConversionRate
    let walletId = options.walletId
    let hint = options.hint

    let memo = `${userAccount},${srcTokenAccount},${srcPrecision} ${srcSymbol},` +
               `${destTokenAccount},${destPrecision} ${destSymbol},${destAccount},` +
               `${maxDestAmount},${minConversionRate},${walletId},${hint}`
    let asset = `${srcAmount} ${srcSymbol}`

    const token = await eos.contract(srcTokenAccount);
    const result = await token.transfer({
      from:userAccount,
      to:networkAccount,
      quantity:asset,
      memo:memo
    }, {
      authorization: [`${userAccount}@active`],
    });
    return result;
}

async function getUserBalance(options){
    let eos = options.eos
    let account = options.account
    let symbol = options.symbol
    let tokenContract = options.tokenContract

    let balanceRes = await eos.getCurrencyBalance({
        code: tokenContract,
        account: account,
        symbol: symbol}
    )
    return parseFloat(balanceRes[0]);
}

export {getBalances, getEnabled, getRate, getRates, trade, getUserBalance, send};
