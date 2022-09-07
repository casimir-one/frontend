import { genRipemd160Hash } from '@casimir.one/toolbox';

const convertStringAsset = (asset) => {
  const [amountStr, symbol] = asset.split(' ');
  const assetId = genRipemd160Hash(symbol); // temp for Graphene migration
  const amount = `${Number(amountStr)}`;
  const [, precisionStr] = amountStr.split('.');
  const precision = precisionStr ? precisionStr.length : 0;
  return { id: assetId, symbol, amount, precision };
}


export {
  convertStringAsset
}