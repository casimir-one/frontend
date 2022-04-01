const defaultProposalInfo = {
  isProposal: false,
  isProposalApproved: true,
  proposalLifetime: new Date(new Date().getTime() + 86400000 * 365 * 3).getTime()
};

export const updateProposalInfo = (payload, overwriteProposalInfo = {}) => {
  const {
    initiator,
    data,
    proposalInfo = {}
  } = payload;

  return {
    initiator,
    data,
    proposalInfo: {
      ...defaultProposalInfo,
      ...proposalInfo,
      ...overwriteProposalInfo
    }
  };
};
