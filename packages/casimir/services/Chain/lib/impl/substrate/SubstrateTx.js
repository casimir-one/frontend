import BaseTx from './../../base/BaseTx';
import { ProtocolChain } from '@casimir.one/platform-core';
import ChainTypes from './ChainTypes';
import { Metadata } from '@polkadot/types';
import { TypeRegistry } from '@polkadot/types';
import { hexToU8a, u8aToHex, isHex } from '@polkadot/util';
import { assert, genSha256Hash, isString } from '@casimir.one/toolbox';
import { 
  pubKeyToAddress, 
  daoIdToAddress, 
  getMultiAddress, 
  getSeedAccount, 
  isAddress, 
  isValidPubKey ,
  toHexFormat
} from './utils';


class SubstrateTx extends BaseTx {

  signedInvariant;
  chainMetadata;

  constructor(trx, chainMetadata, portalId) {

    assert(!!chainMetadata, "Chain metadata must be specified for the Substrate Transaction");

    if (!trx) {
      super(null, [], portalId);
      this.signedInvariant = null;
    } else {
      const { tx, signedInvariant } = trx;
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
      super(tx, ops, portalId);
      this.signedInvariant = signedInvariant;
    }
    
    this.chainMetadata = chainMetadata;
  }

  getProtocolChain() {
    return ProtocolChain.SUBSTRATE;
  };

  getSignedInvariant() {
    return this.signedInvariant;
  }

  getTxSigners(api) {
    const ops = this.getOps();
    const daoSigners = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      const isOnBehalf = op.method.meta.toHex() === api.tx.deipDao.onBehalf.meta.toHex();

      if (!isOnBehalf) {
        assert(op.method.meta.toHex() === api.tx.deipDao.create.meta.toHex(), `All operations except DAO initialization must be sent via the "onBehalf" call.`);
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
    const newDaoMap = {};
    return Promise.all(daoSigners.map((daoSigner) => {

      if (daoSigner.isNewDao) {
        const daoId = daoSigner.daoId;
        const address = daoIdToAddress(daoId, api.registry);
        const createDaoOp = ops.find(op => op.method.meta.toHex() === api.tx.deipDao.create.meta.toHex() && daoId === op.method.args[0].toHex());
        const authority = createDaoOp.method.args[1];
        const threshold = authority.threshold.toBn().toNumber();
        const signatories = authority.signatories.map(signatory => pubKeyToAddress(signatory)).sort();
        const isUserDao = threshold === 0;
        const multiAddress = signatories.length > 1 ? getMultiAddress(signatories, threshold) : null;
        const newDao = {
          address: address,
          daoId: daoId,
          isNewDao: true,
          authority: {
            threshold: threshold,
            signatories: signatories
          },
          multiAddress: multiAddress,
          isUserDao: isUserDao,
          isThreshold1: threshold === 1,
          isRoot: false,
          children: {}
        };
        newDaoMap[daoId] = newDao;
        return Promise.resolve(newDao);
      }
      else {
        const isOnBehalfNewDao = !!newDaoMap[daoSigner.daoId];
        return isOnBehalfNewDao
          ? Promise.resolve(newDaoMap[daoSigner.daoId])
          : api.query.deipDao.daoRepository(daoSigner.daoId)
            .then((daoOpt) => {

              assert(daoOpt.isSome, `DAO actor is not found`);
              const daoId = u8aToHex(daoOpt.value.id);
              const address = daoIdToAddress(daoId, api.registry);
              const authority = daoOpt.value.authority;
              const threshold = authority.threshold.toBn().toNumber();
              const signatories = authority.signatories.map(signatory => pubKeyToAddress(signatory)).sort();
              const isUserDao = threshold === 0;
              const multiAddress = signatories.length > 1 ? getMultiAddress(signatories, threshold) : null;
              const dao = {
                address: address,
                daoId: daoId,
                isNewDao: false,
                authority: {
                  threshold: threshold,
                  signatories: signatories
                },
                multiAddress: multiAddress,
                isUserDao: isUserDao,
                isThreshold1: threshold === 1,
                isRoot: false,
                children: {}
              };
              return dao;
            });
      }
    })
      .reduce((distinct, dao) => {
        if (distinct.some((d) => d.daoId === dao.daoId))
          return distinct;
        return [dao, ...distinct];
      }, []))
      .then((signers) => {

        const buildFlatTree = (address, arr) => {
          return new Promise((resolve) => {
            api.query.deipDao.daoLookup(address)
              .then((opt) => {

                if (opt.isSome) {
                  api.query.deipDao.daoRepository(opt.value)
                    .then((daoOpt) => {
                      const authority = daoOpt.value.authority;
                      const daoId = u8aToHex(daoOpt.value.id);
                      const threshold = authority.threshold.toBn().toNumber();
                      const signatories = authority.signatories.map(signatory => pubKeyToAddress(signatory)).sort();
                      const isUserDao = threshold === 0;
                      const multiAddress = signatories.length > 1 ? getMultiAddress(signatories, threshold) : null;

                      arr.push({
                        address: address,
                        daoId: daoId,
                        isNewDao: false,
                        authority: {
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
          for (let i = 0; i < daoSigner.authority.signatories.length; i++) {
            const flatTree = [daoSigner];
            const signatory = daoSigner.authority.signatories[i];
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
                if (leaf.authority.signatories.includes(parent.address)) {
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

  signAsync(privKey, api, options = { override: false }) {
    assert(super.isFinalized(), 'Transaction is not finalized');
    assert(options.override || !this.getSignedInvariant(), `Transaction is already signed. Set 'override=true' option to override the current signer`);

    const isSuriPath = privKey.indexOf('/') !== -1;
    const keyring = isSuriPath ? getSeedAccount(privKey) : getSeedAccount(`0x${privKey}`);

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
          era: api.registry.createType('ExtrinsicEra', {
            current: signingInfo.header.number,
            period: signingInfo.mortalLength
          }),
          signedExtensions: api.registry.signedExtensions,
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

        const u8a = isHex(this.getTx()) ? hexToU8a(this.getTx()) : this.getTx().toU8a();
        const batchAll = api.registry.createType('Extrinsic', u8a);
        const signingOpsPromises = [];
        const createDaoIds = []

        for (let i = 0; i < batchAll.method.args[0].length; i++) {
          const call = api.registry.createType('Call', batchAll.method.args[0][i].toU8a(), batchAll.method.args[0][i].meta);
          const extrinsic = api.registry.createType('Extrinsic', call);

          const isOnBehalf = extrinsic.method.meta.toHex() === api.tx.deipDao.onBehalf.meta.toHex();
          if (!isOnBehalf) {
            assert(extrinsic.method.meta.toHex() === api.tx.deipDao.create.meta.toHex(), "All operations except account initialization must be send via 'onBehalf' call");
            createDaoIds.push(extrinsic.method.args[0].toHex());
          }

          const daoId = isOnBehalf ? extrinsic.method.args[0].toHex() : extrinsic.method.args[0].toHex();
          const op = isOnBehalf ? extrinsic.method.args[1].toHex() : extrinsic;
          const daoAddress = daoIdToAddress(daoId, api.registry);
          const signersChain = buildSignersChain(signerRoot, daoAddress);
          const signersVector = signersChain.reverse();
          const isOnBehalfNewDao = isOnBehalf && createDaoIds.includes(daoId);

          const opChainPromise = signersVector.reduce((chainPromise, dao, i) => {
            if (dao.isRoot) {
              return chainPromise.then((opChain) => {
                return opChain;
              });
            }
            else if (dao.isUserDao) {
              return chainPromise.then((opChain) => {
                const isOnBehalf = !isHex(opChain) && opChain.method.meta.toHex() === api.tx.deipDao.onBehalf.meta.toHex();
                const onBehalfDaoId = isOnBehalf ? opChain.method.args[0].toHex() : null;
                return (dao.isNewDao || isOnBehalf) && !isOnBehalfNewDao ? opChain : api.tx.deipDao.onBehalf(onBehalfDaoId || dao.daoId, opChain);
              });
            }
            else if (dao.isThreshold1) {
              return chainPromise.then((opChain) => {
                const topDao = signersVector[(i + 1)];
                const others = dao.authority.signatories.filter((signatory) => signatory != topDao.address).sort();
                const isOnBehalf = !isHex(opChain) && opChain.method.meta.toHex() === api.tx.deipDao.onBehalf.meta.toHex();
                const onBehalfDaoId = isOnBehalf ? opChain.method.args[0].toHex() : null;
                return api.tx.multisig.asMultiThreshold1(others, (dao.isNewDao || isOnBehalf) && !isOnBehalfNewDao ? opChain : api.tx.deipDao.onBehalf(onBehalfDaoId || dao.daoId, opChain));
              });
            }
            else {
              return chainPromise.then((opChain) => {
                const isOnBehalf = !isHex(opChain) && opChain.method.meta.toHex() === api.tx.deipDao.onBehalf.meta.toHex();
                const onBehalfDaoId = isOnBehalf ? opChain.method.args[0].toHex() : null;
                const operation = (dao.isNewDao || isOnBehalf) && !isOnBehalfNewDao ? opChain : api.tx.deipDao.onBehalf(onBehalfDaoId || dao.daoId, opChain);

                return Promise.all([
                  api.query.multisig.multisigs(dao.multiAddress, operation.method.hash),
                  operation.paymentInfo ? operation.paymentInfo(dao.multiAddress) : { weight: "18446744073709551615" } // todo: add fallback
                ])
                  .then(([multisigInfo, paymentInfo]) => {
                    const topDao = signersVector[(i + 1)];
                    const others = dao.authority.signatories.filter((signatory) => signatory != topDao.address).sort();
                    const { weight } = paymentInfo;
                    const approvalsCount = multisigInfo.isSome ? multisigInfo.unwrap().approvals.length : 0;
                    const timepoint = multisigInfo.isSome ? multisigInfo.unwrap().when : null;
                    const isLastApproval = (approvalsCount + 1) === dao.authority.threshold;

                    return !isLastApproval
                      ? api.tx.multisig.approveAsMulti(dao.authority.threshold, others, timepoint, operation.method.hash, weight)
                      : api.tx.multisig.asMulti(dao.authority.threshold, others, timepoint, operation.method.toHex(), true, weight);
                  });
              });
            }
          }, Promise.resolve(op));

          signingOpsPromises.push(opChainPromise);
        }

        return Promise.all(signingOpsPromises)
          .then((signingOps) => {
            const batchCall = api.registry.createType('Call', {
              args: { "calls": signingOps },
              callIndex: api.tx.utility.batchAll.callIndex,
            }, api.tx.utility.batchAll.meta);
            
            const tx = api.registry.createType('Extrinsic', batchCall);

            const signingTx = this.isOnBehalfPortal() ? api.tx.deipPortal.exec(toHexFormat(this.getPortalId()), tx) : tx;
            const signedTx = signingTx.sign(keyring, signingMeta);
            this.signedInvariant = signedTx.toHex();
            return this;
          });
      });
  }

  isSigned() {
    return !!this.getSignedInvariant();
  }

  verifyByPortalAsync({ verificationPubKey, verificationPrivKey }, api) {
    assert(!!this.isOnBehalfPortal(), `Transaction is not supposed for tenant verification`);
    assert(super.isFinalized(), 'Transaction is not finalized for tenant verification');
    assert(!!this.isSigned(), `Transaction is not signed for tenant verification`);
    const address = isAddress(verificationPubKey) ? verificationPubKey : isValidPubKey(toHexFormat(verificationPubKey)) ? pubKeyToAddress(toHexFormat(verificationPubKey)) : daoIdToAddress(toHexFormat(verificationPubKey), api.registry);

    return api.derive.tx.signingInfo(address)
      .then((signingInfo) => {

        const signingMeta = {
          nonce: signingInfo.nonce,
          blockHash: signingInfo.header.hash,
          genesisHash: api.genesisHash,
          era: api.registry.createType('ExtrinsicEra', {
            current: signingInfo.header.number,
            period: signingInfo.mortalLength
          }),
          signedExtensions: api.registry.signedExtensions,
          runtimeVersion: api.runtimeVersion,
          version: api.extrinsicVersion
        };

        const isSuriPath = verificationPrivKey.indexOf('/') !== -1;
        const keyring = isSuriPath ? getSeedAccount(verificationPrivKey) : getSeedAccount(toHexFormat(verificationPrivKey));

        const tx = hexToU8a(this.getSignedInvariant());
        const VecU8 = api.registry.createType('Vec<u8>', tx);
        const xt = VecU8.toU8a(); // SCALE codec

        const scheduledTx = api.tx.deipPortal.sign(xt);
        const signedScheduledTx = scheduledTx.sign(keyring, signingMeta);
        
        return signedScheduledTx.send().then(() => {
          return this.getSignedInvariant();
        })

      });
  }

  getRawTx() {
    assert(super.isFinalized(), 'Transaction is not finalized');
    const tx = this.getTx();
    return isString(tx) ? tx : tx.toHex();
  }

  getSignedRawTx() {
    assert(super.isFinalized(), 'Transaction is not finalized');
    assert(!!this.isSigned(), `Transaction is not signed for sending`);
    return this.getSignedInvariant();
  }

  finalize({ chainNodeClient: api }) {
    if (!super.isFinalized()) {
      const batchCall = api.registry.createType('Call', {
        args: { "calls": super.getOps() },
        callIndex: api.tx.utility.batchAll.callIndex,
      }, api.tx.utility.batchAll.meta);
      const tx = api.registry.createType('Extrinsic', batchCall);
      super.finalize(tx);
    }
    return Promise.resolve(this);
  }

  serialize() {
    assert(super.isFinalized(), 'Transaction is not finalized');
    return SubstrateTx.Serialize(this, this.chainMetadata, this.getPortalId());
  }

  deserialize(serializedTx, chainMetadata) {
    return SubstrateTx.Deserialize(serializedTx, chainMetadata);
  }

  static Serialize(tx, chainMetadata, portalId) {
    assert(!!tx, "Transaction is not specified");
    const rawTx = tx.getRawTx();
    const signedInvariant = tx.getSignedInvariant();
    const chainMetadataHash = genSha256Hash(chainMetadata);
    return JSON.stringify({ tx: rawTx, signedInvariant, portalId, chainMetadataHash });
  }

  static Deserialize(serializedTx, chainMetadata) {
    const finalizedTx = JSON.parse(serializedTx);
    const { portalId } = finalizedTx;
    return new SubstrateTx(finalizedTx, chainMetadata, portalId);
  }

}


export default SubstrateTx;
