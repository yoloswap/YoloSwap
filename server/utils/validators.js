import envConfig from "../../src/config/env";

export function validateGetRateParams(srcSymbol, destSymbol, srcToken, destToken, srcAmount) {
  let error = false;
  const eosSymbol = envConfig.EOS.symbol;
  const sourceAmountDecimals = srcAmount ? (srcAmount.toString()).split(".")[1] : false;

  if (!srcSymbol || !destSymbol || !srcAmount) {
    error = `One or more of the required parameters are missing. Please make sure you have srcSymbol, destSymbol and srcAmount`;
  } else if (srcAmount.includes('0x') || isNaN(srcAmount) || srcAmount <= 0) {
    error = `Your source amount is invalid`;
  } else if (!srcToken) {
    error = `${srcSymbol} is not supported by our API`;
  } else if (!destToken) {
    error = `${destSymbol} is not supported by our API`;
  } else if (srcSymbol !== eosSymbol && destSymbol !== eosSymbol) {
    error = `Token to Token Swapping is not yet supported. Please choose EOS as either your srcSymbol or destSymbol`;
  } else if (sourceAmountDecimals && sourceAmountDecimals.length > srcToken.precision) {
    error = `Your ${srcSymbol} source amount's decimals should be no longer than ${srcToken.precision} characters`;
  }

  return error;
}
