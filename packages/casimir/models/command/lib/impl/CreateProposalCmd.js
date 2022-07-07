import { APP_CMD, APP_PROPOSAL } from '@casimir/platform-core';
import { assert } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Create proposal command
 * @extends ProtocolEntityCmd
 */
class CreateProposalCmd extends ProtocolEntityCmd {
  /**
   * Create command for proposal creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {number} cmdPayload.type
   * @param {string} cmdPayload.creator
   * @param {Array.<ProtocolCmd>} cmdPayload.proposedCmds
   * @param {number} cmdPayload.expirationTime
   * @param {number} cmdPayload.reviewPeriodSeconds
   */
  constructor(cmdPayload) {
    const {
      // eslint-disable-next-line no-unused-vars
      entityId,
      type,
      creator,
      proposedCmds,
      expirationTime,
      batchWeight,
      // eslint-disable-next-line no-unused-vars
      reviewPeriodSeconds
    } = cmdPayload;

    assert(
      !!expirationTime && !Number.isNaN(expirationTime),
      "'expirationTime' required and should be in milliseconds"
    );
    assert(!!type, "'type' is required"); // temp limitation
    assert(Object.values(APP_PROPOSAL).includes(type), "'type' is unknown"); // temp limitation
    assert(!!creator, "'creator' is required");
    assert(!!batchWeight, "'batchWeight' is required");

    assert(
      !!proposedCmds && proposedCmds.length,
      'Protocol proposal must contain at least 1 ProtocolCmd'
    );
    for (let i = 0; i < proposedCmds.length; i++) {
      const protocolCmd = proposedCmds[i];
      assert(
        protocolCmd instanceof ProtocolCmd,
        'Proposal can contain only protocol chain commands'
      );
    }

    super(APP_CMD.CREATE_PROPOSAL, cmdPayload);
  }

  getProposedCmds() {
    return this._cmdPayload.proposedCmds;
  }

  getProposalType() {
    return this._cmdPayload.type;
  }

  serialize() {
    return CreateProposalCmd.Serialize(this);
  }

  deserialize(serialized) {
    return CreateProposalCmd.Deserialize(serialized);
  }

  static Serialize(proposalCmd) {
    return {
      CMD_NUM: proposalCmd.getCmdNum(),
      CMD_PAYLOAD: JSON.stringify({
        ...proposalCmd.getCmdPayload(),
        proposedCmds: proposalCmd.getProposedCmds()
          .map((cmd) => {
            const CMD_NUM = cmd.getCmdNum();
            return CMD_NUM === APP_CMD.CREATE_PROPOSAL
              ? CreateProposalCmd.Serialize(cmd)
              : ProtocolCmd.Serialize(cmd);
          })
      })
    };
  }

  static Deserialize(serialized) {
    const { CMD_PAYLOAD } = serialized;
    const payload = JSON.parse(CMD_PAYLOAD);
    return new CreateProposalCmd({
      ...payload,
      proposedCmds: payload.proposedCmds.map((cmd) => {
        const { CMD_NUM } = cmd;
        return CMD_NUM === APP_CMD.CREATE_PROPOSAL
          ? CreateProposalCmd.Deserialize(cmd)
          : ProtocolCmd.Deserialize(cmd);
      })
    });
  }
}

export default CreateProposalCmd;
