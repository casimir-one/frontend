import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { AccessService } from '@deip/access-service';
import { AssetsHttp } from './AssetsHttp';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';

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
      const proposalExpiration = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days;
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

  getAssetById(id) {
    return deipRpc.api.getAssetAsync(id);
  }

  getAssetBySymbol(symbol) {
    return deipRpc.api.getAssetBySymbolAsync(symbol);
  }

  getAssetsByType(type) {
    return deipRpc.api.getAssetsByTypeAsync(type);
  }

  getAssetsByIssuer(issuer) {
    return deipRpc.api.getAssetsByIssuerAsync(issuer);
  }
  
  lookupAssets(lowerBoundSymbol, limit) {
    return deipRpc.api.lookupAssetsAsync(lowerBoundSymbol, limit);
  }

  getAccountAssetBalance(owner, symbol) {
    return deipRpc.api.getAccountAssetBalanceAsync(owner, symbol);
  }

  getAccountAssetsBalancesByOwner(owner) {
    return deipRpc.api.getAccountAssetsBalancesAsync(owner);
  }

  getAccountsAssetBalancesByAsset(symbol) {
    return deipRpc.api.getAccountsAssetBalancesByAssetAsync(symbol);
  }

  createAssetsExchangeProposal({ privKey, username }, {
    party1,
    party2,
    asset1,
    asset2,
    memo,
    extensions
  }) {
    
    const proposalExpiration = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days;

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
