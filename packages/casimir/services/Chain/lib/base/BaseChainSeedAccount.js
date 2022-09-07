import { assert } from '@casimir.one/toolbox';


class BaseChainSeedAccount {
  _username;
  _address;
  _pubKey;
  _privKey;

  constructor({ username, address, pubKey, privKey }) {
    assert(!!username, `'username' is required`);
    assert(!!pubKey, `'pubKey' is required`);
    assert(!!privKey, `'privKey' is required`);

    this._username = username;
    this._address = address;
    this._pubKey = pubKey;
    this._privKey = privKey;
  }

  getUsername() {
    return this._username;
  }

  getAddress() {
    return this._address;
  }

  getPubKey() {
    return this._pubKey;
  }

  getPrivKey() {
    return this._privKey;
  }

  isAuthorizedCreatorRequired() {
    throw new Error("Not implemented exception!");
  }

  signString(msg) {
    throw new Error("Not implemented exception!");
  }
}


export default BaseChainSeedAccount;