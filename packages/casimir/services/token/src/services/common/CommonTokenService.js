import { AssetType, APP_PROPOSAL } from '@casimir.one/platform-core';
import { TransferFTCmd, TransferNFTCmd } from '@casimir.one/commands';
import { makeSingletonInstance } from '@casimir.one/toolbox';
import { CommonTokenHttp } from './CommonTokenHttp';
import { transferToken, updateProposalInfo } from '../../util';

/**
 * Common tokens service
 */
export class CommonTokenService {
  tokenHttp = CommonTokenHttp.getInstance();

  /**
   * Create proposal for asset exchange
   * @param {import('@casimir.one/platform-core').TokenSwapProposalPayload} payload
   * @return {Promise}
   */
  createTokensSwapProposal(payload) {
    const swapPayload = updateProposalInfo(payload, { isProposal: true });

    const {
      data: { party1, party2 }
    } = swapPayload;

    const transferCommands = [];

    if (party1.token.type === AssetType.NFT) {
      transferCommands.push(new TransferNFTCmd({
        from: party1.account,
        to: party2.account,
        nftCollectionId: party1.token.nftCollectionId,
        nftItemId: party1.token.nftItemId
      }));
    } else {
      transferCommands.push(new TransferFTCmd({
        from: party1.account,
        to: party2.account,
        tokenId: party1.token.id,
        amount: party1.token.amount
      }));
    }

    if (party2.token.type === AssetType.NFT) {
      transferCommands.push(new TransferNFTCmd({
        from: party2.account,
        to: party1.account,
        nftCollectionId: party2.token.nftCollectionId,
        nftItemId: party2.token.nftItemId
      }));
    } else {
      transferCommands.push(new TransferFTCmd({
        from: party2.account,
        to: party1.account,
        tokenId: party2.token.id,
        amount: party2.token.amount
      }));
    }

    return transferToken(
      swapPayload,
      transferCommands,
      APP_PROPOSAL.TOKENS_SWAP_PROPOSAL,
      this.tokenHttp.createTokensSwapProposal
    );
  }

  /** @type {() => CommonTokenService} */
  static getInstance = makeSingletonInstance(() => new CommonTokenService());
}
