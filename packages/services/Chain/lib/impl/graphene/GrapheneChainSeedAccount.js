import BaseChainSeedAccount from './../../base/BaseChainSeedAccount';
import GrapheneClient from '@deip/rpc-client';
import { assert, genMd5Hash } from '@deip/toolbox';
import { TextEncoder } from '@polkadot/x-textencoder';
import crypto from '@deip/lib-crypto';


class GrapheneChainSeedAccount extends BaseChainSeedAccount {
  constructor({ username, password, privateKey }) {
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
    const PrivKey = crypto.PrivateKey.from(this.getPrivKey());
    const sig = PrivKey.sign(new TextEncoder('utf-8').encode(genMd5Hash(msg)).buffer);
    return crypto.hexify(sig);
  }
}


export default GrapheneChainSeedAccount;