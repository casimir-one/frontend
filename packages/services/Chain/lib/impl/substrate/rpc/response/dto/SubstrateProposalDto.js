import ProposalDto from './../../../../../base/rpc/response/dto/ProposalDto';
import { fromHexFormat } from './../../../utils';
import { PROPOSAL_STATUS } from '@deip/constants';


class SubstrateProposalDto extends ProposalDto {

  constructor(proposal) {

    const proposalId = fromHexFormat(proposal.id);
    const creator = fromHexFormat(proposal.author);

    let status;
    let failureMsg;
    switch (proposal.state) {
      case 'Pending': {
        status = PROPOSAL_STATUS.PENDING;
        break;
      }
      case 'Done': {
        status = PROPOSAL_STATUS.APPROVED;
        break;
      }
      case 'Rejected': {
        status = PROPOSAL_STATUS.REJECTED;
        break;
      }
      default: {
        if (proposal.state == 'Failed' || proposal.state['Failed']) {
          status = PROPOSAL_STATUS.FAILED;
          failureMsg = proposal.state['Failed'] || "Proposal failed";
        } else {
          status = PROPOSAL_STATUS.PENDING;
        }
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

    
    super({
      proposalId,
      creator,
      status,
      decisionMakers,
      approvers,
      rejectors,
      timestamp,
      serializedProposedTx,
      failureMsg
    });

  }

}


export default SubstrateProposalDto;