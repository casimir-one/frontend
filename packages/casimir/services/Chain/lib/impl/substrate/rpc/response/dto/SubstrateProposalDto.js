import ProposalDto from './../../../../../base/rpc/response/dto/ProposalDto';
import { fromHexFormat } from './../../../utils';
import { PROPOSAL_STATUS } from '@deip/constants';


class SubstrateProposalDto extends ProposalDto {

  constructor(proposal) {

    const proposalId = fromHexFormat(proposal.id);
    const creator = fromHexFormat(proposal.author);

    let status;
    let failureMsg;
    switch (Object.keys(proposal.state)[0]) {
      case 'pending': {
        status = PROPOSAL_STATUS.PENDING;
        break;
      }
      case 'done': {
        status = PROPOSAL_STATUS.APPROVED;
        break;
      }
      case 'rejected': {
        status = PROPOSAL_STATUS.REJECTED;
        break;
      }
      case 'failed': {
        status = PROPOSAL_STATUS.REJECTED;
        failureMsg = proposal.state['failed'] || "Proposal failed";
        break;
      }
      default: {
        status = PROPOSAL_STATUS.PENDING;
        break;
      }
    }

    const decisionMakers = proposal.decisions.map((decision) => {
      return decision.daoId ? fromHexFormat(decision.daoId) : decision.address;
    });
    const approvers = proposal.decisions.filter((decision) => decision.state == 'Approve').map((decision) => {
      return decision.daoId ? fromHexFormat(decision.daoId) : decision.address;
    });
    const rejectors = proposal.decisions.filter((decision) => decision.state == 'Reject').map((decision) => {
      return decision.daoId ? fromHexFormat(decision.daoId) : decision.address;
    });

    const timestamp = proposal.createdAt;
    const serializedProposedTx = proposal.batch;
    const batchWeight = proposal.batchWeight;

    
    super({
      proposalId,
      creator,
      status,
      decisionMakers,
      approvers,
      rejectors,
      timestamp,
      serializedProposedTx,
      failureMsg,
      batchWeight
    });

  }

}


export default SubstrateProposalDto;