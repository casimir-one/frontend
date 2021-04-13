import ProtocolCmd from './base/ProtocolCmd';
import ProtocolEntityCmd from './base/ProtocolEntityCmd';
import { APP_CMD } from './../constants';
import { assert } from '@deip/toolbox';


class CreateProposalCmd extends ProtocolEntityCmd {

  constructor(cmdPayload, txContext) {

    const {
      // entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds,
      extensions
    } = cmdPayload;


    assert(!!proposedCmds && proposedCmds.length, "Protocol proposal must contain at least 1 ProtocolCmd");

    for (let i = 0; i < proposedCmds.length; i++) {
      const protocolCmd = proposedCmds[i];
      assert(protocolCmd instanceof ProtocolCmd, "Proposal can contain only protocol commands");
    }

    assert(!!creator, "Proposal creator is required");
    assert(!!expirationTime, "Proposal expiration time is required");

    super(APP_CMD.CREATE_PROPOSAL, cmdPayload, txContext);
  }

  getProposedCmds() {
    return this._cmdPayload.proposedCmds;
  }

  getProtocolEntityId() {
    const [opName, { external_id: proposalId }] = this.getProtocolOp();
    return proposalId;
  }

  serialize() {
    return CreateProposalCmd.Serialize(this);
  }

  deserialize(serialized) {
    return CreateProposalCmd.Deserialize(serialized);
  }

  static Serialize(proposalCmd) {
    return JSON.stringify({
      PROTOCOL_OP: true,
      PROTOCOL_PROPOSAL: true,
      CMD_NUM: proposalCmd.getCmdNum(),
      CMD_PAYLOAD: {
        ...proposalCmd.getCmdPayload(),
        proposedCmds: proposalCmd.getProposedCmds()
          .map((cmd) => {
            const OP_NUM = cmd.getCmdNum();
            return OP_NUM == APP_CMD.CREATE_PROPOSAL
              ? CreateProposalCmd.Serialize(cmd)
              : ProtocolCmd.Serialize(cmd)
          })
      }
    });
  }

  static Deserialize(serialized) {
    const { CMD_PAYLOAD } = JSON.parse(serialized);
    return new CreateProposalCmd({
      ...CMD_PAYLOAD,
      proposedCmds: CMD_PAYLOAD.proposedCmds.map((cmd) => {
        const { CMD_NUM: OP_NUM } = JSON.parse(cmd);
        return OP_NUM == APP_CMD.CREATE_PROPOSAL
          ? CreateProposalCmd.Deserialize(cmd)
          : ProtocolCmd.Deserialize(cmd)
      })
    });
  }

}


export default CreateProposalCmd;