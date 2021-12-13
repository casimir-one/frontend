import { assert } from '@deip/toolbox';
import { PROPOSAL_STATUS } from '@deip/constants';
import { isValidTimestampFormat } from './../utils';


class ProposalDto {

  constructor({
    proposalId,
    creator,
    status,
    decisionMakers,
    approvers,
    rejectors,
    timestamp,
    serializedProposedTx,
    expirationTime,
    failureMsg
  }) {
    
    assert(!!proposalId, "Proposal ID is not specified");
    assert(!!creator, "Proposal 'creator' is not specified");
    assert(!!status && !!PROPOSAL_STATUS[status], "Proposal 'status' is not specified");
    assert(!!decisionMakers && decisionMakers.length, "Proposal 'decisionMakers' are not specified");
    assert(!!timestamp && isValidTimestampFormat(timestamp), "Proposal 'timestamp' is not specified");
    assert(!!serializedProposedTx, "Proposal 'serializedProposedTx' is not specified");

    this.proposalId = proposalId;
    this.creator = creator;
    this.status = status;
    this.decisionMakers = decisionMakers;
    this.approvers = approvers || [];
    this.rejectors = rejectors || [];
    this.timestamp = timestamp;
    this.serializedProposedTx = serializedProposedTx;
    this.expirationTime = expirationTime || null;
    this.failureMsg = failureMsg || null;
  }

}


export default ProposalDto;
