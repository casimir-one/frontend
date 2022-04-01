import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/messages';
import { AcceptProposalCmd, CreateProposalCmd } from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { wrapInArray } from '@deip/toolbox';

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
            .then((proposalBatchWeight) => {
              const createProposalCmd = new CreateProposalCmd({
                type: proposalType,
                creator: username,
                expirationTime: proposalLifetime,
                proposedCmds: commandsBatch
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
          return transferFn(msg);
        });
    });
}
