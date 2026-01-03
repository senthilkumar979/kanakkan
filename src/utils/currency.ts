/**
 * Currency formatting utilities
 * Uses Euro (€) as the default currency
 */

export const CURRENCY_SYMBOL = '€';
export const CURRENCY_LOCALE = 'de-DE'; // German locale for Euro formatting

/**
 * Formats a number as currency with Euro symbol
 * @param value - The numeric value to format
 * @param options - Intl.NumberFormatOptions for customization
 * @returns Formatted currency string (e.g., "€1,234.56")
 */
export function formatCurrency(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };

  return `${CURRENCY_SYMBOL}${value.toLocaleString(CURRENCY_LOCALE, defaultOptions)}`;
}

/**
 * Formats a number as currency with Euro symbol (absolute value)
 * @param value - The numeric value to format
 * @param options - Intl.NumberFormatOptions for customization
 * @returns Formatted currency string with absolute value
 */
export function formatCurrencyAbsolute(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return formatCurrency(Math.abs(value), options);
}

/**
 * Formats a number as currency with sign prefix (+ or -)
 * @param value - The numeric value to format
 * @param options - Intl.NumberFormatOptions for customization
 * @returns Formatted currency string with sign (e.g., "+€1,234.56" or "-€1,234.56")
 */
export function formatCurrencyWithSign(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatCurrencyAbsolute(value, options)}`;
}

