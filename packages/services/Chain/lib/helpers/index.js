export const toAssetUnits = ({ symbol, precision, amount }) => {
  let value = parseFloat(amount).toFixed(precision);
  return `${value} ${symbol}`;
}

export const millisecToIso = (millisecond) => {
  return new Date(millisecond - (new Date().getTimezoneOffset() * 60000)).toISOString().split('.')[0];
}