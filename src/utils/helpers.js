import BigNumber from "bignumber.js";

export function formatAmount(amount, precision = 6) {
  if (amount === undefined) return;

  const amountBigNumnber = new BigNumber(amount);
  const amountString = amountBigNumnber.toFixed().toString();
  const indexOfDecimal = amountString.indexOf('.');

  return indexOfDecimal !== -1 ? parseFloat(amountString.slice(0, indexOfDecimal + (precision + 1))) : parseFloat(amountString);
}

export function formatHash(hash) {
  return hash.substr(0, 16) + '...' + hash.substr(-6);
}

export function formatNumberWithZeroDigit(number) {
  return +(+number).toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0];
}
