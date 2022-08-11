import { proxydi } from '@casimir/proxydi';
import { JsonDataMsg } from '@casimir/messages';
import { AcceptProposalCmd, CreateProposalCmd } from '@casimir/commands';
import { ChainService } from '@casimir/chain-service';
import { wrapInArray } from '@casimir/toolbox';

/**
 * @typedef {import('@casimir/platform-core').FungibleTokenTransferPayload} FungibleTokenTransferPayload
 * @typedef {import('@casimir/platform-core').NonFungibleTokenTransferPayload} NonFungibleTokenTransferPayload
 *
 * @param {FungibleTokenTransferPayload | NonFungibleTokenTransferPayload} payload
 * @param {*} transferTokenCmd
 * @param {string} proposalType
 * @param {Function} transferFn
 * @return {Promise<Object>}
 */
export function transferToken(
  payload,
  transferTokenCmd,
  proposalType,
  transferFn
) {
  const {
    initiator: {
      privKey,
      username
    },
    proposalInfo: {
      isProposal,
      isProposalApproved,
      proposalLifetime
    }
  } = payload;

  const env = proxydi.get('env');

  return ChainService.getInstanceAsync(env)
    .then((chainService) => {
      const chainNodeClient = chainService.getChainNodeClient();
      const chainTxBuilder = chainService.getChainTxBuilder();
      return chainTxBuilder.begin()
        .then((txBuilder) => {
          const commandsBatch = wrapInArray(transferTokenCmd);

          const buildProposal = () => chainTxBuilder.getBatchWeight(commandsBatch)
            .then((batchWeight) => {
              const createProposalCmd = new CreateProposalCmd({
                type: proposalType,
                creator: username,
                expirationTime: proposalLifetime,
                proposedCmds: commandsBatch,
                batchWeight
              });
              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const updateProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new AcceptProposalCmd({
                  entityId: updateProposalId,
                  account: username,
                  batchWeight
                });
                txBuilder.addCmd(updateProposalCmd);
              }

              return txBuilder.end();
            });

          if (isProposal) {
            return buildProposal();
          }

          for (const cmd of commandsBatch) {
            txBuilder.addCmd(cmd);
          }

          return txBuilder.end();
        })
        .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
        .then((packedTx) => {
          const msg = new JsonDataMsg(packedTx.getPayload());

          if (env.RETURN_MSG === true) {
            return msg;
          }

          return transferFn(msg);
        });
    });
}
