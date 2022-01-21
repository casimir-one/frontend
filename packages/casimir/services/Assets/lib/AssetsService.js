import { genRipemd160Hash, createInstanceGetter } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/messages';
import {
  AcceptProposalCmd,
  CreateProposalCmd,
  TransferAssetCmd,
  CreateFungibleTokenCmd,
  CreateNonFungibleTokenCmd,
  IssueFungibleTokenCmd,
  IssueNonFungibleTokenCmd
} from '@deip/commands';
import { APP_PROPOSAL } from '@deip/constants';
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
   * Transfer asset
   * TODO: change params to object payload
   * @param {Object} initiator
   * @param {string} initiator.privKey
   * @param {string} initiator.username
   * @param {Object} transferInfo
   * @param {string} transferInfo.from
   * @param {string} transferInfo.to
   * @param {Object} transferInfo.asset
   * @param {Object} proposalInfo
   * @return {Promise<Object>}
   */
  transfer(
    { privKey, username },
    { from, to, asset },
    proposalInfo
  ) {
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
            const transferAssetCmd = new TransferAssetCmd({
              from,
              to,
              tokenId: asset.id,
              symbol: asset.symbol,
              precision: asset.precision,
              amount: asset.amount
            });

            if (isProposal) {
              const proposalBatch = [
                transferAssetCmd
              ];

              return chainTxBuilder.getBatchWeight(proposalBatch)
                .then((proposalBatchWeight) => {
                  const createProposalCmd = new CreateProposalCmd({
                    type: APP_PROPOSAL.ASSET_TRANSFER_PROPOSAL,
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
            txBuilder.addCmd(transferAssetCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.transfer(msg);
          });
      });
  }


  /**
   * Create new asset
   * TODO: change params to object payload
   * @typedef {{amount: number, symbol: string, precision: number}} Asset
   * @param {Object} initiator
   * @param {string} initiator.privKey
   * @param {Object} assetInfo
   * @param {string} assetInfo.symbol
   * @param {string} assetInfo.issuer
   * @param {number} assetInfo.precision
   * @param {number} assetInfo.maxSupply
   * @param {number} assetInfo.minBalance
   * @param {string} assetInfo.description
   * @param {Object} assetInfo.projectTokenOption
   * @param {Array.<{account: string, asset: Asset}>} assetInfo.holders
   * @return {Promise<Object>}
   */
  createFungibleToken(
  { privKey }, 
  {
    symbol,
    issuer,
    precision,
    maxSupply,
    minBalance,
    description,
    projectTokenSettings,
    holders
  }) {
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
              projectTokenSettings
            });
            txBuilder.addCmd(createFungibleTokenCmd);
            const tokenId = createFungibleTokenCmd.getProtocolEntityId();

            if (holders && holders.length) {
              for (let i = 0; i < holders.length; i++) {
                const { account, asset } = holders[i];
                const issueFungibleTokenCmd = new IssueFungibleTokenCmd({
                  tokenId,
                  symbol: asset.symbol,
                  precision: asset.precision,
                  amount: asset.amount,
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

  createNonFungibleToken({ privKey }, {
    symbol,
    issuer,
    description,
    projectTokenSettings
  }) {
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const entityId = genRipemd160Hash(symbol);
            const createNonFungibleTokenCmd = new CreateNonFungibleTokenCmd({
              entityId,
              issuer,
              symbol,
              description,
              projectTokenSettings
            });

            txBuilder.addCmd(createNonFungibleTokenCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.createNonFungibleToken(msg);
          });
      });
  }

  issueFungibleToken({ privKey }, {
    issuer,
    asset,
    recipient
  }) {
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const issueFungibleTokenCmd = new IssueFungibleTokenCmd({
              issuer,
              tokenId: asset.id,
              symbol: asset.symbol,
              precision: asset.precision,
              amount: asset.amount,
              recipient
            });
            txBuilder.addCmd(issueFungibleTokenCmd);
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.issueFungibleToken(msg);
          });
      });
  }

  /**
   * Issue new tokens for asset
   * TODO: change params to object payload
   * @param {Object} initiator
   * @param {string} initiator.privKey
   * @param {Object} assetInfo
   * @param {string} assetInfo.issuer
   * @param {string} assetInfo.classId
   * @param {number} assetInfo.instanceId
   * @param {string} assetInfo.recipient
   * @return {Promise<Object>}
   */
  issueNonFungibleToken(
    { privKey }, 
    {
      issuer,
      classId,
      instanceId,
      recipient
    }
  ) {
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const issueNonFungibleTokenCmd = new IssueNonFungibleTokenCmd({
              issuer,
              classId,
              instanceId,
              recipient
            });
            txBuilder.addCmd(issueNonFungibleTokenCmd);
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.issueNonFungibleToken(msg);
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
  getOne(assetId) {
    return this.assetsHttp.getOne(assetId);
  }

  /**
   * Get asset information by asset symbol
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  getOneBySymbol(symbol) {
    return this.assetsHttp.getOneBySymbol(symbol);
  }

  /**
   * Get assets by asset type
   * @param {number} type
   * @return {Promise<Object>}
   */
  getListByType(type) {
    return this.assetsHttp.getListByType(type);
  }

  /**
   * Get assets by tokens issuer
   * @param {string} issuer
   * @return {Promise<Object>}
   */
  getListByIssuer(issuer) {
    return this.assetsHttp.getListByIssuer(issuer);
  }

  /**
   * Get list of assets
   * @param {number} limit
   * @param {string} lowerBoundSymbol
   * @return {Promise<Object>}
   */
  lookupAssets(limit, lowerBoundSymbol) {
    return this.assetsHttp.lookupAssets(limit, lowerBoundSymbol);
  }

  /**
   * Get asset balances by symbol for certain account
   * @param {string} owner
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  getAccountAssetBalance(owner, symbol) {
    return this.assetsHttp.getAccountAssetBalance(owner, symbol);
  }

  /**
   * Get asset balances by owner
   * @param {string} owner
   * @return {Promise<Object>}
   */
  getAccountAssetsBalancesByOwner(owner) {
    return this.assetsHttp.getAccountAssetsBalancesByOwner(owner);
  }

  /**
   * Get certain assets balances for all accounts
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  getAccountsAssetBalancesByAsset(symbol) {
    return this.assetsHttp.getAccountsAssetBalancesByAsset(symbol);
  }

  /**
   * Create proposal for asset exchange
   * TODO: change params to object payload
   * @param {Object} initiator
   * @param {string} initiator.privKey
   * @param {string} initiator.username
   * @param {Object} transferInfo
   * @param {string} transferInfo.party1
   * @param {string} transferInfo.party2
   * @param {Object} transferInfo.asset1
   * @param {Object} transferInfo.asset2
   * @param {Object} proposalInfo
   * @return {Promise}
   */
  createExchangeProposal( // TODO: support NFT
    { privKey, username }, 
    {
      party1,
      party2,
      asset1,
      asset2
    }, 
    proposalInfo
  ) {
    
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
            const transferAssetCmd1 = new TransferAssetCmd({
              from: party1,
              to: party2,
              tokenId: asset1.id,
              symbol: asset1.symbol,
              precision: asset1.precision,
              amount: asset1.amount
            });

            const transferAssetCmd2 = new TransferAssetCmd({
              from: party2,
              to: party1,
              tokenId: asset2.id,
              symbol: asset2.symbol,
              precision: asset2.precision,
              amount: asset2.amount
            });

            const proposalBatch = [
              transferAssetCmd1,
              transferAssetCmd2
            ];

            return chainTxBuilder.getBatchWeight(proposalBatch)
              .then((proposalBatchWeight) => {
                const createProposalCmd = new CreateProposalCmd({
                  type: APP_PROPOSAL.ASSET_EXCHANGE_PROPOSAL,
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
            return this.assetsHttp.createExchangeProposal(msg);
          });
      });
  }

  /**
   * Deposit asset tokens
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator.username
   * @param {string} payload.redirectUrl
   * @param {string} payload.amount
   * @param {string} payload.currency
   * @param {string} payload.account
   * @param {timestamp} payload.timestamp
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
