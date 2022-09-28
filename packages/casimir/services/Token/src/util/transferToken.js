import { proxydi } from '@casimir.one/proxydi';
import { JsonDataMsg } from '@casimir.one/messages';
import { AcceptProposalCmd, CreateProposalCmd } from '@casimir.one/commands';
import { ChainService } from '@casimir.one/chain-service';
import { wrapInArray } from '@casimir.one/toolbox';
import { walletSignTx } from '@casimir.one/platform-util';

/**
 * Build transaction with proposal
 * @param {Array} commandsBatch
 * @param {BaseTxBuilder} chainTxBuilder
 * @param {boolean} isProposalApproved
 * @param {number} proposalLifetime
 * @param {string} proposalType
 * @param {string} username
 * @returns {FinalizedTx}
 */
const buildCommandsProposalTx = async (
  commandsBatch,
  chainTxBuilder,
  isProposalApproved,
  proposalLifetime,
  proposalType,
  username
) => {
  const txBuilder = await chainTxBuilder.begin();
  const batchWeight = await chainTxBuilder.getBatchWeight(commandsBatch);
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
};

/**
 * Build transaction
 * @param {Array} commandsBatch
 * @param {BaseTxBuilder} chainTxBuilder
 * @returns {FinalizedTx}
 */
const buildCommandsTx = async (commandsBatch, chainTxBuilder) => {
  const txBuilder = await chainTxBuilder.begin();

  for (const cmd of commandsBatch) {
    txBuilder.addCmd(cmd);
  }
  return txBuilder.end();
};

/**
 * Pack transaction
 * @param {Array} commandsBatch
 * @param {BaseTxBuilder} chainTxBuilder
 * @param {boolean} isProposal
 * @param {boolean} isProposalApproved
 * @param {number} proposalLifetime
 * @param {string} proposalType
 * @param {string} username
 * @returns {FinalizedTx}
 */
const packTx = async (
  commandsBatch,
  chainTxBuilder,
  isProposal,
  isProposalApproved,
  proposalLifetime,
  proposalType,
  username
) => {
  if (isProposal) {
    return buildCommandsProposalTx(
      commandsBatch,
      chainTxBuilder,
      isProposalApproved,
      proposalLifetime,
      proposalType,
      username
    );
  }

  return buildCommandsTx(commandsBatch, chainTxBuilder);
};

/**
 * @typedef {import('@casimir.one/platform-core').FungibleTokenTransferPayload} FungibleTokenTransferPayload
 * @typedef {import('@casimir.one/platform-core').NonFungibleTokenTransferPayload} NonFungibleTokenTransferPayload
 *
 * @param {FungibleTokenTransferPayload | NonFungibleTokenTransferPayload} payload
 * @param {*} transferTokenCmd
 * @param {string} proposalType
 * @param {Function} transferFn
 * @return {Promise<Object>}
 */
export async function transferToken(
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

  const chainService = await ChainService.getInstanceAsync(env);
  const chainTxBuilder = chainService.getChainTxBuilder();

  const commandsBatch = wrapInArray(transferTokenCmd);

  const packedTx = await packTx(
    commandsBatch,
    chainTxBuilder,
    isProposal,
    isProposalApproved,
    proposalLifetime,
    proposalType,
    username
  );

  const chainNodeClient = chainService.getChainNodeClient();
  const chainInfo = chainService.getChainInfo();
  let signedTx;

  if (env.WALLET_URL) {
    signedTx = await walletSignTx(packedTx, chainInfo);
  } else {
    signedTx = await packedTx.signAsync(privKey, chainNodeClient);
  }
  const msg = new JsonDataMsg(signedTx.getPayload());

  if (env.RETURN_MSG === true) {
    return msg;
  }

  return transferFn(msg);
}
