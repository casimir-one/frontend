import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { AccessService } from '@deip/access-service';
import { AssetsHttp } from './AssetsHttp';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';

const proposalExpiration = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class AssetsService extends Singleton {
  accessService = AccessService.getInstance();
  assetsHttp = AssetsHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  proposalsService = ProposalsService.getInstance();

  transferAssets({ privKey, username }, isProposal, {
    from,
    to,
    amount,
    memo,
    extensions
  }) {

    const transfer_op = ['transfer', {
      from: from,
      to: to,
      amount: amount,
      memo: memo || "",
      extensions: extensions || []
    }];

    if (isProposal) {
      const proposal = {
        creator: username,
        proposedOps: [{ "op": transfer_op }],
        expirationTime: proposalExpiration,
        reviewPeriodSeconds: undefined,
        extensions: []
      }

      return this.proposalsService.createProposal({ privKey, username }, false, proposal)
        .then(({ tx: signedProposalTx }) => {
          return this.assetsHttp.createAssetsTransferProposal({ tx: signedProposalTx })
        });

    } else {

      return this.blockchainService.signOperations([transfer_op], privKey)
        .then((signedTx) => {
          return this.assetsHttp.transferAssets({ tx: signedTx })
        });
    }

  }

  createSecurityTokenAsset({ privKey, username }, {
    researchExternalId,
    researchGroup,
    symbol,
    precision,
    description,
    maxSupply,
    holders
  }) {

    const ops = [];

    const create_security_token_op = ['create_asset', {
      issuer: researchGroup,
      symbol: symbol,
      precision: precision,
      description: description,
      max_supply: maxSupply,
      traits: [
        ['research_security_token', {
          research_external_id: researchExternalId,
          research_group: researchGroup,
          extensions: []
        }],

        ['research_license_revenue', {
          holders_share: `100.00 %`,
          extensions: []
        }]
      ],
      extensions: []
    }];

    ops.push(create_security_token_op);

    for (let i = 0; i < holders.length; i++) {
      const { account, amount } = holders[i];

      const issue_security_token_op = ['issue_asset', {
        issuer: researchGroup,
        amount: amount,
        recipient: account,
        memo: undefined,
        extensions: []
      }];

      ops.push(issue_security_token_op);
    }

    return this.blockchainService.signOperations(ops, privKey)
      .then((signedTx) => {
        return this.blockchainService.sendTransactionAsync(signedTx)
      });
  }

  getAssetById(assetId) {
    return this.assetsHttp.getAssetById(assetId)
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
    memo,
    extensions
  }) {
    
    const party1_transfer_op = ['transfer', {
      from: party1,
      to: party2,
      amount: asset1,
      memo: memo || "",
      extensions: extensions || []
    }];

    const party2_transfer_op = ['transfer', {
      from: party2,
      to: party1,
      amount: asset2,
      memo: memo || "",
      extensions: extensions || []
    }];

    const proposal = {
      creator: username,
      proposedOps: [{ "op": party1_transfer_op }, { "op": party2_transfer_op }],
      expirationTime: proposalExpiration,
      reviewPeriodSeconds: undefined,
      extensions: []
    }

    return this.proposalsService.createProposal({ privKey, username }, false, proposal)
      .then(({ tx: signedProposalTx }) => {
        return this.assetsHttp.createAssetsExchangeProposal({ tx: signedProposalTx })
      });
  }
}

export {
  AssetsService
};
