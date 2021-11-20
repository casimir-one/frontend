import BaseChainSeedAccount from './../../base/BaseChainSeedAccount';
import { u8aToHex } from '@polkadot/util';
import { assert } from '@deip/toolbox';
import { keccakAsHex } from '@polkadot/util-crypto';
import { getSeedAccount } from './utils';


class SubstrateChainSeedAccount extends BaseChainSeedAccount {
  constructor({ username, password, privateKey }) {
    assert((!!password && !privateKey) || (!!privateKey && !password),
      "Either 'password' or 'privateKey' should be specified for seed account generation");

    const secretSeedHex = password ? keccakAsHex(`${username}/${password}`, 256) : `0x${privateKey}`;
    const keyringPair = getSeedAccount(secretSeedHex, { username });
    const pubKey = u8aToHex(keyringPair.publicKey).substring(2);
    const privKey = secretSeedHex.substring(2);
    const address = keyringPair.address;
    super({ username, address, pubKey, privKey });
  }

  isAuthorizedCreatorRequired() {
    return false;
  }

  signString(msg) {
    const keyringPair = getSeedAccount(`0x${this.getPrivKey()}`, { username: this.getUsername() });
    return keyringPair.sign(msg);
  }
}

export default SubstrateChainSeedAccount;