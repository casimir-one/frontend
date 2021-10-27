import { Singleton, genRipemd160Hash } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/message-models';
import {
  UpdateProposalCmd,
  CreateProposalCmd,
  AssetTransferCmd,
  CreateAssetCmd,
  IssueAssetCmd
} from '@deip/command-models';
import { APP_PROPOSAL } from '@deip/constants';
import { AccessService } from '@deip/access-service';
import { ChainService } from '@deip/chain-service';
import crypto from '@deip/lib-crypto';
import { AssetsHttp } from './AssetsHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class AssetsService extends Singleton {
  proxydi = proxydi;

  accessService = AccessService.getInstance();

  assetsHttp = AssetsHttp.getInstance();

  transferAssets({ privKey, username }, {
    from,
    to,
    asset,
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
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const assetTransferCmd = new AssetTransferCmd({
              from,
              to,
              asset,
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

  createAsset({ privKey }, {
    symbol,
    issuer,
    precision,
    maxSupply,
    description,
    projectTokenOption,
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
            const createAssetCmd = new CreateAssetCmd({
              entityId,
              issuer,
              symbol,
              precision,
              maxSupply,
              description,
              projectTokenOption
            });
            txBuilder.addCmd(createAssetCmd);
            const tokenId = createAssetCmd.getProtocolEntityId();

            if (holders && holders.length) {
              for (let i = 0; i < holders.length; i++) {
                const { account, amount } = holders[i];
                const issueAssetCmd = new IssueAssetCmd({
                  assetId: tokenId,
                  issuer,
                  amount,
                  recipient: account
                });
                txBuilder.addCmd(issueAssetCmd);
              }
            }

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.createAsset(msg);
          });
      });
  }

  issueAsset({ privKey }, {
    assetId,
    issuer,
    amount,
    recipient
  }) {
    const env = this.proxydi.get('env');

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const issueAssetCmd = new IssueAssetCmd({
              assetId,
              issuer,
              amount,
              recipient
            });
            txBuilder.addCmd(issueAssetCmd);
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.assetsHttp.issueAsset(msg);
          });
      });
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
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const assetTransferCmd1 = new AssetTransferCmd({
              from: party1,
              to: party2,
              asset: asset1,
              memo: memo || ''
            });

            const assetTransferCmd2 = new AssetTransferCmd({
              from: party2,
              to: party1,
              asset: asset2,
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

  depositAssets(payload) {
    const {
      initiator: { privKey },
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

    const depositDataStr = JSON.stringify(depositData, Object.keys(depositData).sort());
    const privateKey = crypto.PrivateKey.from(privKey);
    const sigBuff = privateKey.sign(new TextEncoder('utf-8').encode(depositDataStr).buffer);
    const sigHex = crypto.hexify(sigBuff);

    return this.assetsHttp.depositAssets(
      {
        ...depositData,
        sigHex,
        redirectUrl
      }
    );
  }
}

export {
  AssetsService
};
