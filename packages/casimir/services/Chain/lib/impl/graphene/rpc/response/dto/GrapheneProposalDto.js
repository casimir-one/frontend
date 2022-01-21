import ProposalDto from './../../../../../base/rpc/response/dto/ProposalDto';


class GrapheneProposalDto extends ProposalDto {

  constructor(proposalState) {

    const proposalId = proposalState.external_id;
    const creator = proposalState.proposer;
    const status = proposalState.status;
    const decisionMakers = [...proposalState.required_approvals];
    const approvers = [...proposalState.approvals.map(([daoId]) => daoId)];
    const rejectors = [...proposalState.rejectors.map(([daoId]) => daoId)];
    const timestamp = new Date(proposalState.created_at).getTime();
    const expirationTime = new Date(proposalState.expiration_time).getTime();
    const serializedProposedTx = proposalState.serialized_proposed_transaction;
    const failureMsg = proposalState.fail_reason;
    const batchWeight = null;

    super({
      proposalId,
      creator,
      status,
      decisionMakers,
      approvers,
      rejectors,
      timestamp,
      expirationTime,
      serializedProposedTx,
      failureMsg,
      batchWeight
    });

  }

}


export default GrapheneProposalDto;