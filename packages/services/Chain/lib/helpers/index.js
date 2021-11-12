export const toAssetUnits = ({ symbol, precision, amount }) => {
  let value = parseFloat(amount).toFixed(precision);
  return `${value} ${symbol}`;
}

export const millisecToIso = (millisecond) => {
  return new Date(millisecond).toISOString().split('.')[0];
}