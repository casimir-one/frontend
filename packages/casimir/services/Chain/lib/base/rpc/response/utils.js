

const isValidAssetFormat = (asset) => {
  return !!asset && asset.id && asset.symbol && !isNaN(asset.precision) && (asset.amount || asset.amount === 0);
};

const isValidTimestampFormat = (timestamp) => {
  return typeof timestamp === 'number' && (new Date(timestamp)).getTime() > 0;
}



export {
  isValidAssetFormat,
  isValidTimestampFormat
}