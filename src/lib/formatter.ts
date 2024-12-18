const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  style: "currency",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  if (amount) return CURRENCY_FORMATTER.format(amount);
  return amount;
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-IN");

export function formatNumber(number: number) {
  if (number) return NUMBER_FORMATTER.format(number);
  return number;
}
