import BaseChainSeedAccount from './../../base/BaseChainSeedAccount';
import { assert, genMd5Hash } from '@casimir/toolbox';
import { TextEncoder } from "web-encoding"


class GrapheneChainSeedAccount extends BaseChainSeedAccount {
  constructor({ username, password, privateKey }) {
    const GrapheneClient = require('./rpc-client');

    assert((!!password && !privateKey) || (!!privateKey && !password),
      "Either 'password' or 'privateKey' should be specified for account generation");

    if (password) {
      const {
        ownerPubkey: pubKey,
        owner: privKey
      } = GrapheneClient.auth.getPrivateKeys(username, password, ['owner']);

      super({ username, address: pubKey, pubKey, privKey });
    } else {
      const pubKey = GrapheneClient.auth.wifToPublic(privateKey);
      super({ username, address: null, pubKey, privKey: privateKey });
    }
  }

  isAuthorizedCreatorRequired() {
    return true;
  }

  signString(msg) {
    const crypto = require('@casimir/lib-crypto');
    const PrivKey = crypto.PrivateKey.from(this.getPrivKey());
    const sig = PrivKey.sign(new TextEncoder('utf-8').encode(genMd5Hash(msg)).buffer);
    return crypto.hexify(sig);
  }
}


export default GrapheneChainSeedAccount;
