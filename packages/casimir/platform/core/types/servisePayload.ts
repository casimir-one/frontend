export type ServicePayloadInitiator = {
  privateKey: string,
  username?: string
};

export type ServicePayloadProposalInfo = {
  isProposal: boolean,
  isProposalApproved: boolean,
  proposalLifetime:number
};

export type ServiceBasePayload<D = Record<string, unknown>> = {
  data: D,
  initiator?: ServicePayloadInitiator,
  proposalInfo?: ServicePayloadProposalInfo
};
