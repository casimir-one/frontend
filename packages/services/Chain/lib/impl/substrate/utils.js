import { u8aToHex, hexToU8a, isU8a, isHex } from '@polkadot/util';
import { encodeAddress, decodeAddress, blake2AsU8a, createKeyMulti, randomAsHex } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/api';


const pubKeyToAddress = (pubKey, addressFormat = 42) => {
  const address = encodeAddress(isU8a(pubKey) ? u8aToHex(pubKey) : pubKey, addressFormat);
  return address;
}


const daoIdToAddress = (daoId, registry) => {
  const H160 = registry.createType('H160', daoId);
  const VecU8 = registry.createType('Vec<u8>', H160);
  const scaleVecU8 = VecU8.toU8a();
  const hash = blake2AsU8a(scaleVecU8, 256);
  const pubKey = registry.createType('AccountId', hash);
  return pubKeyToAddress(pubKey);
}


const isAddress = (address, addressFormat) => {
  try {
    encodeAddress(
      isHex(address)
        ? hexToU8a(address)
        : decodeAddress(address, false, addressFormat),
      addressFormat
    );
    return true;
  } catch (error) {
    return false;
  }
}


const getMultiAddress = (addresses, threshold) => {
  const multiAddress = createKeyMulti([...addresses].sort(), threshold);
  return u8aToHex(multiAddress);
}


const getAccountFromJson = (json, password, options = { type: 'sr25519' }) => {
  const keyring = new Keyring(options);
  const account = keyring.createFromJson(json);
  account.unlock(password);
  return account;
}


const getAccountFromSeed = (meta = {}, seed = randomAsHex(32), options = { type: 'sr25519' }) => {
  const keyring = new Keyring(options);
  const account = keyring.addFromUri(seed, meta);
  return account;
}


export {
  pubKeyToAddress,
  daoIdToAddress,
  isAddress,
  getMultiAddress,
  getAccountFromJson,
  getAccountFromSeed
}