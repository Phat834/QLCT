export function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function parseCurrency(value: string): number {
  if (!value) return 0;
  return Number(value.replace(/\./g, ''));
}
