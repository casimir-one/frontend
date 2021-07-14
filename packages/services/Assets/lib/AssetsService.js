import { Singleton } from '@deip/toolbox';
import { BlockchainService } from '@deip/blockchain-service';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/message-models';
import {
  APP_PROPOSAL,
  UpdateProposalCmd,
  CreateProposalCmd,
  AssetTransferCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { AssetsHttp } from './AssetsHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class AssetsService extends Singleton {
  proxydi = proxydi;

  assetsHttp = AssetsHttp.getInstance();

  blockchainService = BlockchainService.getInstance();

  transferAssets({ privKey, username }, {
    from,
    to,
    amount,
    memo
  }, proposalInfo) {
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
        const txBuilder = chainService.getChainTxBuilder();
        return txBuilder.begin()
          .then(() => {
            const assetTransferCmd = new AssetTransferCmd({
              from,
              to,
              amount,
              memo: memo || ''
            });

            if (isProposal) {
              const createProposalCmd = new CreateProposalCmd({
                type: APP_PROPOSAL.ASSET_TRANSFER_PROPOSAL,
                creator: username,
                expirationTime: proposalLifetime || proposalDefaultLifetime,
                proposedCmds: [assetTransferCmd]
              });

              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const updateProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new UpdateProposalCmd({
                  entityId: updateProposalId,
                  activeApprovalsToAdd: [username]
                });

                txBuilder.addCmd(updateProposalCmd);
              }
            } else {
              txBuilder.addCmd(assetTransferCmd);
            }
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.transferAssets(msg);
          });
      });
  }

  createSecurityTokenAsset({ privKey }, {
    researchExternalId,
    researchGroup,
    symbol,
    precision,
    description,
    maxSupply,
    holders
  }) {
    const ops = [];

    const createSecurityTokenOp = ['create_asset', {
      issuer: researchGroup,
      symbol,
      precision,
      description,
      max_supply: maxSupply,
      traits: [
        ['research_security_token', {
          research_external_id: researchExternalId,
          research_group: researchGroup,
          extensions: []
        }],

        ['research_license_revenue', {
          holders_share: '100.00 %',
          extensions: []
        }]
      ],
      extensions: []
    }];

    ops.push(createSecurityTokenOp);

    for (let i = 0; i < holders.length; i++) {
      const { account, amount } = holders[i];

      const issueSecurityTokenOp = ['issue_asset', {
        issuer: researchGroup,
        amount,
        recipient: account,
        memo: undefined,
        extensions: []
      }];

      ops.push(issueSecurityTokenOp);
    }

    return this.blockchainService.signOperations(ops, privKey)
      .then((signedTx) => this.blockchainService.sendTransactionAsync(signedTx));
  }

  getAccountDepositHistory(account, status) {
    return this.assetsHttp.getAccountDepositHistory(account, status);
  }

  getAssetById(assetId) {
    return this.assetsHttp.getAssetById(assetId);
  }

  getAssetBySymbol(symbol) {
    return this.assetsHttp.getAssetBySymbol(symbol);
  }

  getAssetsByType(type) {
    return this.assetsHttp.getAssetsByType(type);
  }

  getAssetsByIssuer(issuer) {
    return this.assetsHttp.getAssetsByIssuer(issuer);
  }

  lookupAssets(lowerBoundSymbol, limit) {
    return this.assetsHttp.lookupAssets(lowerBoundSymbol, limit);
  }

  getAccountAssetBalance(owner, symbol) {
    return this.assetsHttp.getAccountAssetBalance(owner, symbol);
  }

  getAccountAssetsBalancesByOwner(owner) {
    return this.assetsHttp.getAccountAssetsBalancesByOwner(owner);
  }

  getAccountsAssetBalancesByAsset(symbol) {
    return this.assetsHttp.getAccountsAssetBalancesByAsset(symbol);
  }

  createAssetsExchangeProposal({ privKey, username }, {
    party1,
    party2,
    asset1,
    asset2,
    memo
  }, proposalInfo) {
    const { isProposalApproved, proposalLifetime } = {
      isProposalApproved: true,
      proposalLifetime: proposalDefaultLifetime,
      ...proposalInfo
    };

    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const txBuilder = chainService.getChainTxBuilder();
        return txBuilder.begin()
          .then(() => {
            const assetTransferCmd1 = new AssetTransferCmd({
              from: party1,
              to: party2,
              amount: asset1,
              memo: memo || ''
            });

            const assetTransferCmd2 = new AssetTransferCmd({
              from: party2,
              to: party1,
              amount: asset2,
              memo: memo || ''
            });

            const createProposalCmd = new CreateProposalCmd({
              type: APP_PROPOSAL.ASSET_EXCHANGE_PROPOSAL,
              creator: username,
              expirationTime: proposalLifetime || proposalDefaultLifetime,
              proposedCmds: [assetTransferCmd1, assetTransferCmd2]
            });

            txBuilder.addCmd(createProposalCmd);

            const updateProposalId = createProposalCmd.getProtocolEntityId();

            if (isProposalApproved) {
              const updateProposalCmd = new UpdateProposalCmd({
                entityId: updateProposalId,
                activeApprovalsToAdd: [username]
              });

              txBuilder.addCmd(updateProposalCmd);
            }
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.createAssetsExchangeProposal(msg);
          });
      });
  }
}

export {
  AssetsService
};
