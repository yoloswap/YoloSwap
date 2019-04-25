export function formatAmount(amount, precision = 6) {
  if (amount === undefined) return;

  const amountString = amount.toFixed(18).toString();
  const indexOfDecimal = amountString.indexOf('.');

  return indexOfDecimal !== -1 ? parseFloat(amountString.slice(0, indexOfDecimal + (precision + 1))) : parseFloat(amountString);
}
