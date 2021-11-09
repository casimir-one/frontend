import { u8aToHex, hexToU8a, isU8a, isHex, stringToU8a } from '@polkadot/util';
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
  const prefix = stringToU8a("deip/DAOs/");
  const hash = blake2AsU8a([...prefix, ...scaleVecU8], 256);
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

const isValidPrivKey = (privKey) => {
  return isHex(privKey) && hexToU8a(privKey).length === 32;
}

const isValidPubKey = (pubKey) => {
  return isHex(pubKey) && hexToU8a(pubKey).length === 32;
}

const getMultiAddress = (addresses, threshold) => {
  const multiAddress = createKeyMulti([...addresses].sort(), threshold);
  return u8aToHex(multiAddress);
}

const getSeedAccountFromJson = (json, password, options = { type: 'sr25519' }) => {
  const keyring = new Keyring(options);
  const keyringPair = keyring.createFromJson(json);
  keyringPair.unlock(password);
  return keyringPair;
}


const getSeedAccount = (meta = {}, seed = randomAsHex(32), options = { type: 'sr25519' }) => {
  const keyring = new Keyring(options);
  const keyringPair = keyring.addFromUri(seed, meta);
  return keyringPair;
}


const verifySignature = (pubKey, msg, sig, options = { type: 'sr25519' }) => {
  const address = pubKeyToAddress(pubKey);
  const keyring = new Keyring(options);
  const keyringPair = keyring.addFromAddress(address);
  return keyringPair.verify(msg, sig, keyringPair.publicKey);
}


export {
  pubKeyToAddress,
  daoIdToAddress,
  isAddress,
  getMultiAddress,
  getSeedAccountFromJson,
  getSeedAccount,
  verifySignature,
  isValidPrivKey,
  isValidPubKey
}