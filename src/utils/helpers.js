export function formatAmount(amount, precision) {
  return parseFloat((+amount).toFixed(precision))
}
