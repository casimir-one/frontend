import { PROPOSAL_TYPES } from '@deip/research-group-service';

const schemasMap = {

  [PROPOSAL_TYPES.START_RESEARCH]: (researchGroupId, title, abstract, permlink, reviewShareInPercent, dropoutCompensationInPercent, disciplines, isPrivate) => ({
    research_group_id: researchGroupId,
    title,
    abstract,
    permlink,
    review_share_in_percent: reviewShareInPercent,
    dropout_compensation_in_percent: dropoutCompensationInPercent,
    disciplines,
    is_private: isPrivate
  }),

  [PROPOSAL_TYPES.INVITE_MEMBER]: (researchGroupId, name, researchGroupTokenAmount, coverLetter) => ({
    research_group_id: researchGroupId,
    name,
    research_group_token_amount_in_percent: researchGroupTokenAmount,
    cover_letter: coverLetter
  }),

  [PROPOSAL_TYPES.SEND_FUNDS]: (researchGroupId, recipient, funds) => ({
    research_group_id: researchGroupId,
    recipient,
    funds
  }),

  [PROPOSAL_TYPES.START_RESEARCH_TOKEN_SALE]: (researchId, startTime, endTime, amount, softCap, hardCap) => ({
    research_id: researchId,
    start_time: startTime,
    end_time: endTime,
    amount_for_sale: amount,
    soft_cap: softCap,
    hard_cap: hardCap
  }),

  [PROPOSAL_TYPES.CHANGE_QUORUM]: (researchGroupId, proposalType, quorumPercent) => ({
    research_group_id: researchGroupId,
    proposal_type: proposalType,
    quorum_percent: quorumPercent
  }),

  [PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: (researchId, type, title, permlink, content, authors, references, externalReferences) => ({
    research_id: researchId,
    type,
    title,
    permlink,
    content,
    authors,
    references,
    external_references: externalReferences
  }),

  [PROPOSAL_TYPES.CHANGE_RESEARCH_GROUP_META_DATA_TYPE]: (researchGroupId, newResearchGroupName, newResearchGroupDescription) => ({
    research_group_id: researchGroupId,
    research_group_name: newResearchGroupName,
    research_group_description: newResearchGroupDescription
  }),

  [PROPOSAL_TYPES.CHANGE_RESEARCH_META_DATA_TYPE]: (researchId, newResearchTitle, newResearchAbstract, isPrivate) => ({
    research_id: researchId,
    research_title: newResearchTitle,
    research_abstract: newResearchAbstract,
    is_private: isPrivate
  }),

  [PROPOSAL_TYPES.DROPOUT_MEMBER]: (name) => ({
    name
  })

};

export {
  schemasMap
};
