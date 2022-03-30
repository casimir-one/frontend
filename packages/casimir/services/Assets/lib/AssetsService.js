import { genRipemd160Hash, genSha256Hash, createInstanceGetter } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/messages';
import {
  AcceptProposalCmd,
  CreateProposalCmd,
  TransferFungibleTokenCmd,
  TransferNonFungibleTokenCmd,
  CreateFungibleTokenCmd,
  CreateNonFungibleTokenCmd,
  IssueFungibleTokenCmd,
  IssueNonFungibleTokenCmd
} from '@deip/commands';
import { APP_PROPOSAL, ASSET_TYPE } from '@deip/constants';
import { AccessService } from '@deip/access-service';
import { ChainService } from '@deip/chain-service';
import { AssetsHttp } from './AssetsHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

/**
 * Assets data provider
 */
export class AssetsService {
  proxydi = proxydi;

  accessService = AccessService.getInstance();

  assetsHttp = AssetsHttp.getInstance();

  /**
   * Create new fungible token
   * @param {import('@casimir/platform-core').FungibleTokenCreatePayload} payload
   * @return {Promise<Object>}
   */
  createFungibleToken(payload) {
    const {
      initiator: { privKey },
      data: {
        symbol,
        issuer,
        precision,
        maxSupply,
        minBalance,
        description,
        metadata,
        holders
      }
    } = payload;
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const entityId = genRipemd160Hash(symbol);
            const createFungibleTokenCmd = new CreateFungibleTokenCmd({
              entityId,
              issuer,
              symbol,
              precision,
              maxSupply,
              minBalance,
              description,
              metadata
            });
            txBuilder.addCmd(createFungibleTokenCmd);
            const tokenId = createFungibleTokenCmd.getProtocolEntityId();

            if (holders && holders.length) {
              for (let i = 0; i < holders.length; i++) {
                const { account, token } = holders[i];
                const issueFungibleTokenCmd = new IssueFungibleTokenCmd({
                  tokenId,
                  amount: token.amount,
                  issuer,
                  recipient: account
                });
                txBuilder.addCmd(issueFungibleTokenCmd);
              }
            }

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.createFungibleToken(msg);
          });
      });
  }

  /**
   * Create new non-fungible token
   * @param {import('@casimir/platform-core').NonFungibleTokenCreatePayload} payload
   * @return {Promise<Object>}
   */
  createNonFungibleToken(payload) {
    const {
      initiator: { privKey },
      data: {
        issuer,
        name,
        metadata = {},
        description,
        holders
      }
    } = payload;
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const metadataHash = genSha256Hash(metadata);
            const createNonFungibleTokenCmd = new CreateNonFungibleTokenCmd({
              issuer,
              name,
              description,
              metadata,
              metadataHash
            });

            txBuilder.addCmd(createNonFungibleTokenCmd);
            const tokenId = createNonFungibleTokenCmd.getProtocolEntityId();

            if (holders && holders.length) {
              for (let i = 0; i < holders.length; i++) {
                const {
                  account: recipient,
                  metadata: instanceMetadata = {},
                  instanceId
                } = holders[i];
                const instanceMetadataHash = genSha256Hash(instanceMetadata);
                const issueNonFungibleTokenCmd = new IssueNonFungibleTokenCmd({
                  issuer,
                  classId: tokenId,
                  instanceId: instanceId || i + 1,
                  recipient,
                  metadata: instanceMetadata,
                  metadataHash: instanceMetadataHash
                });
                txBuilder.addCmd(issueNonFungibleTokenCmd);
              }
            }

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.createNonFungibleToken(msg);
          });
      });
  }

  /**
   * Issue fungible token
   * @param {import('@casimir/platform-core').FungibleTokenIssuePayload} payload
   * @return {Promise<Object>}
   */
  issueFungibleToken(payload) {
    const {
      initiator: { privKey },
      data: {
        issuer,
        tokenId,
        amount,
        recipient
      }
    } = payload;
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const issueFungibleTokenCmd = new IssueFungibleTokenCmd({
              issuer,
              tokenId,
              amount,
              recipient
            });
            txBuilder.addCmd(issueFungibleTokenCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.issueFungibleToken(msg);
          });
      });
  }

  /**
   * Issue non-fungible token
   * @param {import('@casimir/platform-core').NonFungibleTokenIssuePayload} payload
   * @return {Promise<Object>}
   */
  issueNonFungibleToken(payload) {
    const {
      initiator: { privKey },
      data: {
        issuer,
        classId,
        instanceId,
        recipient,
        metadata
      }
    } = payload;
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const metadataHash = genSha256Hash(metadata);
            const issueNonFungibleTokenCmd = new IssueNonFungibleTokenCmd({
              issuer,
              classId,
              instanceId,
              recipient,
              metadata,
              metadataHash
            });
            txBuilder.addCmd(issueNonFungibleTokenCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.issueNonFungibleToken(msg);
          });
      });
  }

  /**
    * Transfer fungible token
    * TODO: change params to object payload
    * @param {Object} initiator
    * @param {string} initiator.privKey
    * @param {string} initiator.username
    * @param {Object} transferInfo
    * @param {string} transferInfo.from
    * @param {string} transferInfo.to
    * @param {Object} transferInfo.token
    * @param {Object} proposalInfo
    * @return {Promise<Object>}
    */
  transferFungibleToken(payload) {
    const {
      initiator: { privKey, username },
      data: { from, to, token },
      proposalInfo
    } = payload;

    const { isProposal, isProposalApproved, proposalLifetime } = {
      isProposal: false,
      isProposalApproved: true,
      proposalLifetime: proposalDefaultLifetime,
      ...proposalInfo
    };

    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const transferFungibleTokenCmd = new TransferFungibleTokenCmd({
              from,
              to,
              tokenId: token.id,
              amount: token.amount
            });

            if (isProposal) {
              const proposalBatch = [
                transferFungibleTokenCmd
              ];

              return chainTxBuilder.getBatchWeight(proposalBatch)
                .then((proposalBatchWeight) => {
                  const createProposalCmd = new CreateProposalCmd({
                    type: APP_PROPOSAL.FT_TRANSFER_PROPOSAL,
                    creator: username,
                    expirationTime: proposalLifetime || proposalDefaultLifetime,
                    proposedCmds: proposalBatch
                  });
                  txBuilder.addCmd(createProposalCmd);

                  if (isProposalApproved) {
                    const updateProposalId = createProposalCmd.getProtocolEntityId();
                    const updateProposalCmd = new AcceptProposalCmd({
                      entityId: updateProposalId,
                      account: username,
                      batchWeight: proposalBatchWeight
                    });
                    txBuilder.addCmd(updateProposalCmd);
                  }

                  return txBuilder.end();
                });
            }
            txBuilder.addCmd(transferFungibleTokenCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.transferFungibleToken(msg);
          });
      });
  }

  /**
    * Transfer non-fungible token
    * TODO: change params to object payload
    * @param {Object} initiator
    * @param {string} initiator.privKey
    * @param {string} initiator.username
    * @param {Object} transferInfo
    * @param {string} transferInfo.from
    * @param {string} transferInfo.to
    * @param {Object} transferInfo.token
    * @param {Object} proposalInfo
    * @return {Promise<Object>}
    */
  transferNonFungibleToken(payload) {
    const {
      initiator: { privKey, username },
      data: { from, to, token },
      proposalInfo
    } = payload;

    const { isProposal, isProposalApproved, proposalLifetime } = {
      isProposal: false,
      isProposalApproved: true,
      proposalLifetime: proposalDefaultLifetime,
      ...proposalInfo
    };

    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const transferNonFungibleTokenCmd = new TransferNonFungibleTokenCmd({
              from,
              to,
              classId: token.classId,
              instanceId: token.instanceId
            });

            if (isProposal) {
              const proposalBatch = [
                transferNonFungibleTokenCmd
              ];

              return chainTxBuilder.getBatchWeight(proposalBatch)
                .then((proposalBatchWeight) => {
                  const createProposalCmd = new CreateProposalCmd({
                    type: APP_PROPOSAL.NFT_TRANSFER_PROPOSAL,
                    creator: username,
                    expirationTime: proposalLifetime || proposalDefaultLifetime,
                    proposedCmds: proposalBatch
                  });
                  txBuilder.addCmd(createProposalCmd);

                  if (isProposalApproved) {
                    const updateProposalId = createProposalCmd.getProtocolEntityId();
                    const updateProposalCmd = new AcceptProposalCmd({
                      entityId: updateProposalId,
                      account: username,
                      batchWeight: proposalBatchWeight
                    });
                    txBuilder.addCmd(updateProposalCmd);
                  }

                  return txBuilder.end();
                });
            }
            txBuilder.addCmd(transferNonFungibleTokenCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.transferNonFungibleToken(msg);
          });
      });
  }

  /**
   * Deposit history for certain account
   * @param {string} account
   * @param {string} status
   * @return {Promise<Object>}
   */
  getAccountDepositHistory(account, status) {
    return this.assetsHttp.getAccountDepositHistory(account, status);
  }

  /**
   * Get certain asset information
   * @param {string} assetId
   * @return {Promise<Object>}
   */
  getFungibleToken(tokenId) {
    return this.assetsHttp.getFungibleToken(tokenId);
  }

  /**
   * Get asset information by asset symbol
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  getFungibleTokenBySymbol(symbol) {
    return this.assetsHttp.getFungibleTokenBySymbol(symbol);
  }

  /**
   * Get assets by asset type
   * @param {number} type
   * @return {Promise<Object>}
   */
  getFungibleTokensListByType(type) {
    return this.assetsHttp.getFungibleTokensListByType(type);
  }

  /**
   * Get non-fungible token by account
   * @param {string} account
   * @return {Promise<Object>}
   */
  getNonFungibleTokenByAccount(account) {
    return this.assetsHttp.getNonFungibleTokenByAccount(account);
  }

  /**
   * Get assets by tokens issuer
   * @param {string} issuer
   * @return {Promise<Object>}
   */
  getFungibleTokensListByIssuer(issuer) {
    return this.assetsHttp.getFungibleTokensListByIssuer(issuer);
  }

  /**
   * Get list of assets
   * @param {number} limit
   * @param {string} lowerBoundSymbol
   * @return {Promise<Object>}
   */
  lookupFungibleTokens(limit, lowerBoundSymbol) {
    return this.assetsHttp.lookupFungibleTokens(limit, lowerBoundSymbol);
  }

  /**
   * Get asset balances by symbol for certain account
   * @param {string} owner
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  getAccountFungibleTokenBalance(owner, symbol) {
    return this.assetsHttp.getAccountFungibleTokenBalance(owner, symbol);
  }

  /**
   * Get asset balances by owner
   * @param {string} owner
   * @return {Promise<Object>}
   */
  getAccountFungibleTokensBalancesByOwner(owner) {
    return this.assetsHttp.getAccountFungibleTokensBalancesByOwner(owner);
  }

  /**
   * Get certain assets balances for all accounts
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  getAccountsFungibleTokenBalancesByFungibleToken(symbol) {
    return this.assetsHttp.getAccountsFungibleTokenBalancesByFungibleToken(symbol);
  }

  /**
   * Get non-fungible token
   * @param {string} classId
   * @return {Promise<Object>}
   */
  getNonFungibleTokenClass(classId) {
    return this.assetsHttp.getNonFungibleTokenClass(classId);
  }

  /**
   * Get non-fungible tokens
   * @return {Promise<Object>}
   */
  getNonFungibleTokenClasses() {
    return this.assetsHttp.getNonFungibleTokenClasses();
  }

  /**
   * Get non-fungible token instances by owner and non-fungible token
   * @param {string} account
   * @param {string} classId
   * @return {Promise<Object>}
   */
  getNonFungibleTokenClassInstancesByOwner(account, classId) {
    return this.assetsHttp.getNonFungibleTokenClassInstancesByOwner(account, classId);
  }

  /**
   * Get non-fungible token instances by owner
   * @param {string} account
   * @return {Promise<Object>}
   */
  getNonFungibleTokenClassesInstancesByOwner(account) {
    return this.assetsHttp.getNonFungibleTokenClassesInstancesByOwner(account);
  }

  /**
   * Get assets by type
   * @param {number} type
   * @return {Promise<Object>}
   */
  getAssetsByType(type) {
    return this.assetsHttp.getAssetsByType(type);
  }

  /**
   * Get assets by issuer
   * @param {string} issuer
   * @return {Promise<Object>}
   */
  getAssetsByIssuer(issuer) {
    return this.assetsHttp.getAssetsByIssuer(issuer);
  }

  /**
   * Get all assets
   * @param {number} limit
   * @return {Promise<Object>}
   */
  lookupAssets(limit) {
    return this.assetsHttp.lookupAssets(limit);
  }

  /**
   * Create proposal for asset exchange
   * @todo: add NFT support
   * @param {import('@casimir/platform-core').AssetExchangeProposalPayload} payload
   * @return {Promise}
   */
  createExchangeProposal(payload) {
    const {
      initiator: { privKey, username },
      data: {
        party1,
        party2,
        token1,
        token2
      },
      proposalInfo
    } = payload;

    const { isProposalApproved, proposalLifetime } = {
      isProposalApproved: true,
      proposalLifetime: proposalDefaultLifetime,
      ...proposalInfo
    };

    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            let transferTokenCmd1;
            let transferTokenCmd2;

            if (token1.type === ASSET_TYPE.NFT) {
              transferTokenCmd1 = new TransferNonFungibleTokenCmd({
                from: party1,
                to: party2,
                classId: token1.classId,
                instanceId: token1.instanceId
              });
            } else {
              transferTokenCmd1 = new TransferFungibleTokenCmd({
                from: party1,
                to: party2,
                tokenId: token1.id,
                amount: token1.amount
              });
            }

            if (token2.type === ASSET_TYPE.NFT) {
              transferTokenCmd2 = new TransferNonFungibleTokenCmd({
                from: party2,
                to: party1,
                classId: token2.classId,
                instanceId: token2.instanceId
              });
            } else {
              transferTokenCmd2 = new TransferFungibleTokenCmd({
                from: party2,
                to: party1,
                tokenId: token2.id,
                amount: token2.amount
              });
            }

            const proposalBatch = [
              transferTokenCmd1,
              transferTokenCmd2
            ];

            return chainTxBuilder.getBatchWeight(proposalBatch)
              .then((proposalBatchWeight) => {
                const createProposalCmd = new CreateProposalCmd({
                  type: APP_PROPOSAL.TOKENS_SWAP_PROPOSAL,
                  creator: username,
                  expirationTime: proposalLifetime || proposalDefaultLifetime,
                  proposedCmds: proposalBatch
                });
                txBuilder.addCmd(createProposalCmd);

                const updateProposalId = createProposalCmd.getProtocolEntityId();

                if (isProposalApproved) {
                  const updateProposalCmd = new AcceptProposalCmd({
                    entityId: updateProposalId,
                    account: username,
                    batchWeight: proposalBatchWeight
                  });
                  txBuilder.addCmd(updateProposalCmd);
                }

                return txBuilder.end();
              });
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.createTokensSwapProposal(msg);
          });
      });
  }

  /**
   * Deposit asset tokens
   * @param {import('@casimir/platform-core').AssetDepositPayload} payload
   * @return {Promise<Object>}
   */
  deposit(payload) {
    const {
      initiator: { privKey, username },
      redirectUrl,
      amount,
      currency,
      account,
      timestamp
    } = payload;

    const depositData = {
      amount,
      currency,
      account,
      timestamp
    };

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const seedAccount = chainService.generateChainSeedAccount({
          username,
          privateKey: privKey
        });
        const sigSource = JSON.stringify(depositData, Object.keys(depositData).sort());
        const sigHex = seedAccount.signString(sigSource);
        return this.assetsHttp.deposit(
          {
            ...depositData,
            sigSource,
            sigHex,
            redirectUrl
          }
        );
      });
  }

  /** @type {() => AssetsService} */
  static getInstance = createInstanceGetter(AssetsService);
}
