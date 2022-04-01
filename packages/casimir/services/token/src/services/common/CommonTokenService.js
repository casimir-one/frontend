import { APP_PROPOSAL, ASSET_TYPE } from '@deip/constants';
import { TransferFungibleTokenCmd, TransferNonFungibleTokenCmd } from '@deip/commands';
import { createInstanceGetter } from '@deip/toolbox';
import { CommonTokenHttp } from './CommonTokenHttp';
import { transferToken, updateProposalInfo } from '../../util';

export class CommonTokenService {
  tokenHttp = CommonTokenHttp.getInstance();

  /**
   * Create proposal for asset exchange
   * @param {import('@casimir/platform-core').TokenSwapProposalPayload} payload
   * @return {Promise}
   */
  createTokensSwapProposal(payload) {
    const swapPayload = updateProposalInfo(payload, { isProposal: true });

    const {
      data: { party1, party2 }
    } = swapPayload;

    const transferCommands = [];

    if (party1.token.type === ASSET_TYPE.NFT) {
      transferCommands.push(new TransferNonFungibleTokenCmd({
        from: party1.account,
        to: party2.account,
        classId: party1.token.classId,
        instanceId: party1.token.instanceId
      }));
    } else {
      transferCommands.push(new TransferFungibleTokenCmd({
        from: party1.account,
        to: party2.account,
        tokenId: party1.token.id,
        amount: party1.token.amount
      }));
    }

    if (party2.token.type === ASSET_TYPE.NFT) {
      transferCommands.push(new TransferNonFungibleTokenCmd({
        from: party2.account,
        to: party1.account,
        classId: party2.token.classId,
        instanceId: party2.token.instanceId
      }));
    } else {
      transferCommands.push(new TransferFungibleTokenCmd({
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
  static getInstance = createInstanceGetter(CommonTokenService);
}
