import deipRpc from '@deip/rpc-client';
import crypto from '@deip/lib-crypto';
import { Singleton } from '@deip/toolbox';
import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';
import { ResearchGroupHttp } from './ResearchGroupHttp';
import { UsersService } from '@deip/users-service';

const proposalExpiration = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class ResearchGroupService extends Singleton {
  researchGroupHttp = ResearchGroupHttp.getInstance();

  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance();

  proposalsService = ProposalsService.getInstance();

  usersService = UsersService.getInstance();

  _mapResearchGroup(rg) {
    return { ...rg };
  }

  createResearchGroup(privKey, {
    fee,
    creator,
    accountOwnerAuth,
    accountActiveAuth,
    accountMemoPubKey,
    accountJsonMetadata,
    accountExtensions
  },
  formData
  ) {
    const onchainData = JSON.parse(formData.get("onchainData"));
    const offchainMeta = JSON.parse(formData.get("offchainMeta"));

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {
        const [research_group_external_id, create_account_op] = deipRpc.operations.createEntityOperation(['create_account', {
          fee,
          creator,
          owner: accountOwnerAuth,
          active: accountActiveAuth,
          active_overrides: onchainData.researchGroupThresholdOverrides,
          memo_key: accountMemoPubKey,
          json_metadata: accountJsonMetadata,
          traits: [[
            'research_group',
            {
              description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.attributes)).buffer)),
              extensions: []
            }
          ]],
          extensions: accountExtensions
        }], refBlock);

        return this.blockchainService.signOperations([create_account_op], privKey, refBlock)
          .then((signedTx) => {
            formData.append("tx", JSON.stringify(signedTx))

            return this.researchGroupHttp.createResearchGroup({
              researchGroupExternalId: research_group_external_id,
              formData
            })
        });
      });
  }


  updateResearchGroupAccount({ privKey, username }, isProposal, {
    researchGroupExternalId,
    accountOwnerAuth,
    accountActiveAuth,
    accountActiveAuthOverrides,
    accountMemoPubKey,
    accountJsonMetadata,
    accountExtensions
  },
  formData
  ) {
    const offchainMeta = JSON.parse(formData.get("offchainMeta"));

    const update_account_op = ['update_account', {
      account: researchGroupExternalId,
      owner: accountOwnerAuth,
      active: accountActiveAuth,
      active_overrides: accountActiveAuthOverrides,
      memo_key: accountMemoPubKey,
      json_metadata: accountJsonMetadata,
      traits: [[
        'research_group',
        {
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.attributes)).buffer)),
          extensions: []
        }
      ]],
      extensions: accountExtensions
    }];

    formData.append("isProposal", isProposal);

    if (isProposal) {
      const proposal = {
        creator: username,
        proposedOps: [{ op: update_account_op }],
        expirationTime: proposalExpiration,
        reviewPeriodSeconds: undefined,
        extensions: []
      };

      return this.proposalsService.createProposal({ privKey, username }, false, proposal)
        .then(({ tx: signedProposalTx }) => {
          formData.append("tx", JSON.stringify(signedProposalTx))

          return this.researchGroupHttp.updateResearchGroup({researchGroupExternalId, formData})
        });
    }

    return this.blockchainService.signOperations([update_account_op], privKey)
      .then((signedTx) => {
        formData.append("tx", JSON.stringify(signedTx))

        return this.researchGroupHttp.updateResearchGroup({researchGroupExternalId, formData})
      });
  }

  createResearchGroupInvite({ privKey, username }, {
    member,
    researchGroup,
    rewardShare,
    researches,
    extensions
  }, { notes }) {
    const offchainMeta = { notes };

    const join_research_group_membership_op = ['join_research_group_membership', {
      member,
      research_group: researchGroup,
      reward_share: rewardShare,
      researches,
      extensions
    }];

    const proposal = {
      creator: username,
      proposedOps: [{ op: join_research_group_membership_op }],
      expirationTime: proposalExpiration,
      reviewPeriodSeconds: undefined,
      extensions: []
    };

    return this.proposalsService.createProposal({ privKey, username }, false, proposal)
      .then(({ tx: signedProposalTx }) => this.researchGroupHttp.createResearchGroupInvite({ tx: signedProposalTx, offchainMeta }));
  }

  leaveResearchGroup(
    { privKey, username },
    {
      member,
      researchGroup,
      isExclusion,
      extensions
    },
    {
      notes
    }
  ) {
    const offchainMeta = { notes };

    const leave_research_group_membership_op = ['leave_research_group_membership', {
      member,
      research_group: researchGroup,
      is_exclusion: isExclusion,
      extensions
    }];

    const proposal = {
      creator: username,
      proposedOps: [{ op: leave_research_group_membership_op }],
      expirationTime: proposalExpiration,
      reviewPeriodSeconds: undefined,
      extensions: []
    };

    return this.proposalsService.createProposal({ privKey, username }, false, proposal)
      .then(({ tx: signedProposalTx }) => this.researchGroupHttp.leaveResearchGroup({ tx: signedProposalTx, offchainMeta }));
  }

  getResearchGroupPendingInvites(researchGroupExternalId) {
    return this.researchGroupHttp.getResearchGroupPendingInvites(researchGroupExternalId);
  }

  getResearchGroup(teamId) {
    return Promise.all([
      this.researchGroupHttp.getResearchGroup(teamId),
      this.usersService.getUsersByResearchGroup(teamId)
    ]).then(([group, members]) => ({
      ...group,
      members
    }));
  }

  getResearchGroups(externalIds) {
    return Promise.all(externalIds.map((externalId) => this.getResearchGroup(externalId)));
  }

  getResearchGroupsListing(personal = false) {
    return this.researchGroupHttp.getResearchGroupsListing(personal);
  }

  getTeamsByUser(user) {
    return this.researchGroupHttp.getTeamsByUser(user)
  }

  getResearchGroupsByTenant(tenantId) {
    return this.researchGroupHttp.getResearchGroupsByTenant(tenantId)
  }

  getJoinRequestsByGroup(groupId) {
    return this.researchGroupHttp.getJoinRequestsByGroup(groupId);
  }

  getJoinRequestsByUser(username) {
    return this.researchGroupHttp.getJoinRequestsByUser(username);
  }

  createJoinRequest(data) {
    return this.researchGroupHttp.createJoinRequest(data);
  }

  updateJoinRequest(update) {
    return this.researchGroupHttp.updateJoinRequest(update);
  }
}

export {
  ResearchGroupService
};
