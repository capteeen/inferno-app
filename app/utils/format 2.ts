/**
 * Format a number with commas and abbreviate large numbers
 */
export const formatNumber = (num: number): string => {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  return num.toLocaleString();
};

/**
 * Format a price with appropriate decimal places
 */
export const formatPrice = (price: number): string => {
  if (price < 0.01) {
    return price.toFixed(6);
  }
  if (price < 1) {
    return price.toFixed(4);
  }
  if (price < 100) {
    return price.toFixed(2);
  }
  return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

/**
 * Format a percentage with a + or - sign and 2 decimal places
 */
export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}; 