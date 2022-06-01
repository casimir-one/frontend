import { TextEncoder } from "web-encoding"

const toAssetUnits = ({ symbol, precision, amount }) => {
  let value = parseFloat(amount).toFixed(precision);
  return `${value} ${symbol}`;
}

const millisecToIso = (millisecond) => {
  return new Date(millisecond).toISOString().split('.')[0];
}

const isValidPrivKey = (privKey) => {
  const GrapheneClient = require('@deip/rpc-client');
  return GrapheneClient.auth.isWif(privKey);
}

const verifySignature = (pubKey, msg, sig) => {
  const crypto = require('@deip/lib-crypto');

  const publicKey = crypto.PublicKey.from(pubKey);
  let isValid;
  try {
    isValid = publicKey.verify(new TextEncoder("utf-8").encode(msg).buffer, crypto.unhexify(sig).buffer);
  } catch (err) {
    isValid = false;
  }
  return isValid;
}

export {
  toAssetUnits,
  millisecToIso,
  verifySignature,
  isValidPrivKey
}