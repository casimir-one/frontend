import BaseTx from './../../base/BaseTx';
import { PROTOCOL_CHAIN } from '@deip/constants';
import ChainTypes from './ChainTypes';
import { Metadata } from '@polkadot/metadata';
import { TypeRegistry } from '@polkadot/types';
import { hexToU8a, u8aToHex, isHex } from '@polkadot/util';
import { assert } from '@deip/toolbox';
import { pubKeyToAddress, daoIdToAddress, getMultiAddress } from './utils';

class SubstrateTx extends BaseTx {

  chainMetadata;
  signedInvariant;

  constructor(trx) {
    if (!trx) {
      super();
      this.signedInvariant = null;
    } else {
      const { tx, chainMetadata, signedInvariant } = trx;
      const ops = [];
      const registry = new TypeRegistry();
      registry.register(ChainTypes);
      registry.setMetadata(new Metadata(registry, chainMetadata));
      const batchAll = registry.createType('Extrinsic', hexToU8a(tx));
      for (let i = 0; i < batchAll.method.args[0].length; i++) {
        const call = registry.createType('Call', hexToU8a(batchAll.method.args[0][i].toHex()), batchAll.method.args[0][i].meta);
        const op = registry.createType('Extrinsic', call);
        ops.push(op);
      }
      super(tx, ops);
      this.chainMetadata = chainMetadata;
      this.signedInvariant = signedInvariant;
    }
  }

  getProtocolChain() {
    return PROTOCOL_CHAIN.SUBSTRATE;
  };

  getChainMetadata() {
    return this.chainMetadata;
  }

  getSignedInvariant() {
    return this.signedInvariant;
  }

  getTxSigners(api) {
    const ops = this.getOps();
    const daoSigners = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      const isOnBehalf = op.method.meta.toHex() === api.tx.deipOrg.onBehalf.meta.toHex();

      if (!isOnBehalf) {
        assert(op.method.meta.toHex() === api.tx.deipOrg.create.meta.toHex(), `All operations except DAO initialization must be sent via the "onBehalf" call.`);
        const daoId = op.method.args[0].toHex();
        daoSigners.push({ daoId: daoId, isNewDao: true });
      } else {
        const daoId = op.method.args[0].toHex();
        if (!daoSigners.some((dao) => { dao.daoId === daoId })) {
          daoSigners.push({ daoId: daoId, isNewDao: false });
        }
      }
    }

    return daoSigners;
  }

  getTxSignersTree(api) {
    const ops = this.getOps();
    const daoSigners = this.getTxSigners(api);
    return Promise.all(daoSigners.map((daoSigner) => {

      if (daoSigner.isNewDao) {
        const daoId = daoSigner.daoId;
        const address = daoIdToAddress(daoId, api.registry);
        const createDaoOp = ops.find(op => op.method.meta.toHex() === api.tx.deipOrg.create.meta.toHex() && daoId === op.method.args[0].toHex());
        const membersKeySource = createDaoOp.method.args[1];
        const threshold = membersKeySource.threshold.toBn().toNumber();
        const signatories = membersKeySource.signatories.map(signatory => pubKeyToAddress(signatory)).sort();
        const isUserDao = threshold === 0;
        const multiAddress = signatories.length > 1 ? getMultiAddress(signatories, threshold) : null;

        return Promise.resolve({
          address: address,
          daoId: daoId,
          isNewDao: true,
          membersKeySource: {
            threshold: threshold,
            signatories: signatories
          },
          multiAddress: multiAddress,
          isUserDao: isUserDao,
          isThreshold1: threshold === 1,
          isRoot: false,
          children: {}
        });

      } else {

        return api.query.deipOrg.orgRepository(daoSigner.daoId)
          .then((opt) => {
            assert(opt.isSome, `DAO actor is not found`);
            const daoId = u8aToHex(opt.value.name);
            const address = daoIdToAddress(daoId, api.registry);
            const membersKeySource = opt.value.members_key_source;
            const threshold = membersKeySource.threshold.toBn().toNumber();
            const signatories = membersKeySource.signatories.map(signatory => pubKeyToAddress(signatory)).sort();
            const isUserDao = threshold === 0;
            const multiAddress = signatories.length > 1 ? getMultiAddress(signatories, threshold) : null;

            return {
              address: address,
              daoId: daoId,
              isNewDao: false,
              membersKeySource: {
                threshold: threshold,
                signatories: signatories
              },
              multiAddress: multiAddress,
              isUserDao: isUserDao,
              isThreshold1: threshold === 1,
              isRoot: false,
              children: {}
            }
          });
      }
    }))
      .then((signers) => {

        const buildFlatTree = (address, arr) => {
          return new Promise((resolve) => {
            api.query.deipOrg.orgLookup(address)
              .then((opt) => {

                if (opt.isSome) {
                  api.query.deipOrg.orgRepository(opt.value)
                    .then((daoOpt) => {
                      const membersKeySource = daoOpt.value.members_key_source;
                      const daoId = u8aToHex(daoOpt.value.name);
                      const threshold = membersKeySource.threshold.toBn().toNumber();
                      const signatories = membersKeySource.signatories.map(signatory => pubKeyToAddress(signatory)).sort();
                      const isUserDao = threshold === 0;
                      const multiAddress = signatories.length > 1 ? getMultiAddress(signatories, threshold) : null;

                      arr.push({
                        address: address,
                        daoId: daoId,
                        isNewDao: false,
                        membersKeySource: {
                          threshold: threshold,
                          signatories: signatories
                        },
                        multiAddress: multiAddress,
                        isUserDao: isUserDao,
                        isThreshold1: threshold === 1,
                        isRoot: false,
                        children: {}
                      });

                      Promise.all(signatories.map((signatory) => buildFlatTree(signatory, arr)))
                        .then(() => { resolve(arr); });
                    });

                } else {

                  arr.push({
                    address: address,
                    isRoot: true,
                    children: {}
                  });
                  resolve(arr);

                }

              });
          });
        }

        return Promise.all(signers.reduce((arr, daoSigner) => {
          for (let i = 0; i < daoSigner.membersKeySource.signatories.length; i++) {
            const flatTree = [daoSigner];
            const signatory = daoSigner.membersKeySource.signatories[i];
            arr.push(buildFlatTree(signatory, flatTree));
          }
          return arr;
        }, []))
          .then((flatTrees) => {

            const setChildren = (parents, leaf) => {
              for (let j = 0; j < parents.length; j++) {
                const parent = parents[j];
                if (Object.keys(parent.children).length) {
                  setChildren(Object.values(parent.children), leaf);
                }
                if (leaf.membersKeySource.signatories.includes(parent.address)) {
                  parent.children[leaf.address] = leaf;
                }
              }
            }
            
            return flatTrees.reduce((tree, flatTree) => {
              for (let i = flatTree.length - 1; i >= 0; i--) {
                const leaf = flatTree[i];
                if (leaf.isRoot && tree[leaf.address] === undefined) {
                  tree[leaf.address] = leaf;
                } else if (!leaf.isRoot) {
                  setChildren(Object.values(tree), leaf);
                }
              }
              return tree;
            }, {});
          });
      });
  }

  signAsync(keyring, api, options = { override: false }) {
    assert(super.isFinalized(), 'Transaction is not finalized');
    assert(options.override || !this.getSignedInvariant(), `Transaction is already signed. Set 'override=true' option to override the current signer`);

    const registry = api.registry;

    return Promise.all([
      this.getTxSignersTree(api),
      api.derive.tx.signingInfo(keyring.address)
    ]) 
      .then(([signersTree, signingInfo]) => {
        const signerRoot = signersTree[keyring.address];
        assert(!!signerRoot, `${keyring.address} address is not authorized to sign the transaction`);

        const signingMeta = {
          nonce: signingInfo.nonce,
          blockHash: signingInfo.header.hash,
          genesisHash: api.genesisHash,
          era: registry.createType('ExtrinsicEra', {
            current: signingInfo.header.number,
            period: signingInfo.mortalLength
          }),
          signedExtensions: registry.signedExtensions,
          runtimeVersion: api.runtimeVersion,
          version: api.extrinsicVersion
        };


        const buildSignersChain = (currentLeaf, address, parentLeafs = []) => {
          let result = null;
          if (currentLeaf.children[address]) {
            result = [...parentLeafs, currentLeaf, currentLeaf.children[address]];
          } else {
            for (let i = 0; i < Object.keys(currentLeaf.children).length; i++) {
              const key = Object.keys(currentLeaf.children)[i];
              const childLeaf = currentLeaf.children[key];
              result = buildSignersChain(childLeaf, address, [...parentLeafs, currentLeaf]);
              if (!!result) break;
            }
          }
          return result;
        }

        const batchAll = registry.createType('Extrinsic', this.getTx().toU8a());
        const signingOpsPromises = [];

        for (let i = 0; i < batchAll.method.args[0].length; i++) {
          const call = registry.createType('Call', batchAll.method.args[0][i].toU8a(), batchAll.method.args[0][i].meta);
          const extrinsic = registry.createType('Extrinsic', call);

          const isOnBehalf = extrinsic.method.meta.toHex() === api.tx.deipOrg.onBehalf.meta.toHex();
          if (!isOnBehalf) {
            assert(extrinsic.method.meta.toHex() === api.tx.deipOrg.create.meta.toHex(), "All operations except account initialization must be send via 'onBehalf' call");
          }

          const daoId = isOnBehalf ? extrinsic.method.args[0].toHex() : extrinsic.method.args[0].toHex();
          const op = isOnBehalf ? extrinsic.method.args[1].toHex() : extrinsic;
          const daoAddress = daoIdToAddress(daoId, registry);

          const signersChain = buildSignersChain(signerRoot, daoAddress);
          const signersVector = signersChain.reverse();

          const opChainPromise = signersVector.reduce((chainPromise, dao, i) => {
            if (dao.isRoot) {
              return chainPromise.then((opChain) => {
                return opChain;
              });
            }
            else if (dao.isUserDao) {
              return chainPromise.then((opChain) => {
                return dao.isNewDao ? opChain : api.tx.deipOrg.onBehalf(dao.daoId, opChain);
              });
            }
            else if (dao.isThreshold1) {
              return chainPromise.then((opChain) => {
                const topDao = signersVector[(i + 1)];
                const others = dao.membersKeySource.signatories.filter((signatory) => signatory != topDao.address).sort();
                const isOnBehalf = !isHex(opChain) && opChain.method.meta.toHex() === api.tx.deipOrg.onBehalf.meta.toHex();
                return api.tx.multisig.asMultiThreshold1(others, dao.isNewDao || isOnBehalf ? opChain : api.tx.deipOrg.onBehalf(dao.daoId, opChain));
              });
            }
            else {
              return chainPromise.then((opChain) => {
                const operation = dao.isNewDao ? opChain : api.tx.deipOrg.onBehalf(dao.daoId, opChain);
                return Promise.all([
                  api.query.multisig.multisigs(dao.multiAddress, operation.method.hash),
                  operation.paymentInfo ? operation.paymentInfo(dao.multiAddress) : { weight: 1000000 } // todo: add fallback
                ])
                  .then(([multisigInfo, paymentInfo]) => {
                    const topDao = signersVector[(i + 1)];
                    const others = dao.membersKeySource.signatories.filter((signatory) => signatory != topDao.address).sort();
                    const { weight } = paymentInfo;
                    const approvalsCount = multisigInfo.isSome ? multisigInfo.unwrap().approvals.length : 0;
                    const timepoint = multisigInfo.isSome ? multisigInfo.unwrap().when : null;
                    const isLastApproval = (approvalsCount + 1) === dao.membersKeySource.threshold;

                    return !isLastApproval
                      ? api.tx.multisig.approveAsMulti(dao.membersKeySource.threshold, others, timepoint, operation.method.hash, weight)
                      : api.tx.multisig.asMulti(dao.membersKeySource.threshold, others, timepoint, operation.method.toHex(), true, weight);
                  });
              });
            }
          }, Promise.resolve(op));

          signingOpsPromises.push(opChainPromise);
        }

        return Promise.all(signingOpsPromises)
          .then((signingOps) => {
            const batchCall = registry.createType('Call', {
              args: { "calls": signingOps },
              callIndex: api.tx.utility.batchAll.callIndex,
            }, api.tx.utility.batchAll.meta);

            const signingTx = registry.createType('Extrinsic', batchCall);
            const signedTx = signingTx.sign(keyring, signingMeta);
            this.signedInvariant = signedTx.toHex();
            return this;
          });
      });
  }

  isSigned() {
    return !!this.getSignedInvariant();
  }

  signByTenantAsync({ tenant, tenantPrivKey }, api) {
    assert(super.isFinalized(), 'Transaction is not finalized');
    // TODO: add extension
    return Promise.resolve(this);
  }

  getRawTx() {
    assert(super.isFinalized(), 'Transaction is not finalized');
    return this.getTx().toHex();
  }

  sendAsync(chainApi) {
    assert(super.isFinalized(), 'Transaction is not finalized');
    assert(!!this.isSigned(), `Transaction is not signed for sending`);
    return chainApi.sendTxAsync(this.getSignedInvariant());
  }

  finalize({ chainNodeClient: api }) {
    if (!super.isFinalized()) {
      return api.rpc.state.getMetadata()
        .then((chainMetadata) => {
          const batchCall = api.registry.createType('Call', {
            args: { "calls": super.getOps() },
            callIndex: api.tx.utility.batchAll.callIndex,
          }, api.tx.utility.batchAll.meta);

          const tx = api.registry.createType('Extrinsic', batchCall);
          this.chainMetadata = chainMetadata.toHex();
          super.finalize(tx);
          return this;
        });
    } else {
      return Promise.resolve(this);
    }
  }

  serialize() {
    assert(super.isFinalized(), 'Transaction is not finalized');
    return SubstrateTx.Serialize(this);
  }

  deserialize(serialized) {
    return SubstrateTx.Deserialize(serialized);
  }

  static Serialize(tx) {
    assert(!!tx, "Transaction is not specified");
    const rawTx = tx.getRawTx();
    const chainMetadata = tx.getChainMetadata();
    const signedInvariant = tx.getSignedInvariant();
    return JSON.stringify({ tx: rawTx, chainMetadata, signedInvariant });
  }

  static Deserialize(serialized) {
    const finalized = JSON.parse(serialized);
    return new SubstrateTx(finalized);
  }

}


export default SubstrateTx;
