export function formatAmount(amount, precision) {
  if (amount === undefined) return;

  const amountString = amount.toString();

  return parseFloat(amountString.slice(0, (amountString.indexOf('.')) + (precision + 1)));
}
