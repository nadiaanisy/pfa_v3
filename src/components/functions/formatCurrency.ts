export const formatCurrency = (value: number, preferredCurrency: string) =>
  new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: preferredCurrency,
    minimumFractionDigits: 2,
  }).format(value);