import BigNumber from "bignumber.js";

export function formatAmount(amount, precision = 6) {
  if (amount === undefined) return;

  const amountBigNumnber = new BigNumber(amount);
  const amountString = amountBigNumnber.toFixed().toString();
  const indexOfDecimal = amountString.indexOf('.');

  return indexOfDecimal !== -1 ? parseFloat(amountString.slice(0, indexOfDecimal + (precision + 1))) : parseFloat(amountString);
}
