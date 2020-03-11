import deipRpc from '@deip/deip-oa-rpc-client';
import { UsersService } from '@deip/users-service';
import { ResearchContentService } from '@deip/research-content-service';
import { Singleton } from '@deip/toolbox';
import { AppConfigService } from '@deip/app-config-service';
import { researchContentTypes } from './lists';
import { ResearchHttp } from './ResearchHttp';

class ResearchService extends Singleton {
  researchHttp = ResearchHttp.getInstance();

  usersService = UsersService.getInstance();

  researchContentService = ResearchContentService.getInstance();

  _deipRpcInstance;

  get deipRpc() {
    if (!this._deipRpcInstance) {
      const env = AppConfigService.getInstance().get('env');

      this._deipRpcInstance = deipRpc;

      this._deipRpcInstance.api.setOptions({
        url: env.DEIP_FULL_NODE_URL,
        reconnectTimeout: 3000
      });

      this._deipRpcInstance.config.set('chain_id', env.CHAIN_ID);
    }
    return this._deipRpcInstance;
  }

  getResearchContentEciHistoryRecords(researchContentId, disciplineId) {
    const RESEARCH_CONTENT_ECI_SOURCES = {
      1: { type: 'review', text: 'Review added' },
      2: { type: 'vote_for_review', text: 'Review supported' },
      3: { type: 'init', text: 'Material uploaded' }
    };

    function mapResearchContentEciHistoryRecord(item) {
      const source = item.op[1];
      const record = {
        researchContentId: source.research_content_id,
        disciplineId: source.discipline_id,
        newAmount: source.new_eci_amount,
        delta: source.delta,
        action: RESEARCH_CONTENT_ECI_SOURCES[source.action].type,
        actionText: RESEARCH_CONTENT_ECI_SOURCES[source.action].text,
        actionObjectId: source.action_object_id,
        timestamp: source.timestamp * 1000
      };
      if (!record.action) {
        throw new Error('Unsupported source found');
      }
      return record;
    }

    return this.deipRpc.api.getEciHistoryByContentAndDisciplineAsync(researchContentId, disciplineId)
      .then((history) => history.map(mapResearchContentEciHistoryRecord));
  }

  getResearchEciHistoryRecords(researchId, disciplineId) {
    const RESEARCH_ECI_SOURCES = {
      1: { type: 'review', text: 'Review added' },
      2: { type: 'vote_for_review', text: 'Review supported' },
      3: { type: 'init', text: 'Material uploaded' }
    };

    function mapResearchEciHistoryRecord(item) {
      const source = item.op[1];
      const record = {
        researchId: source.research_id,
        disciplineId: source.discipline_id,
        newAmount: source.new_eci_amount,
        delta: source.delta,
        action: RESEARCH_ECI_SOURCES[source.action].type,
        actionText: RESEARCH_ECI_SOURCES[source.action].text,
        actionObjectId: source.action_object_id,
        timestamp: source.timestamp * 1000
      };
      if (!record.action) {
        throw new Error('Unsupported source found');
      }
      return record;
    }

    return this.deipRpc.api.getEciHistoryByResearchAndDisciplineAsync(researchId, disciplineId)
      .then((history) => history.map(mapResearchEciHistoryRecord));
  }

  async getResearchContentOuterReferences(researchContent, acc) {
    const outerReferences = await this.deipRpc.api.getContentsReferToContentAsync(researchContent.id);

    for (let i = 0; i < outerReferences.length; i++) {
      const item = outerReferences[i];
      const {
        trx_id, block, timestamp, op
      } = item;
      const [opName, payload] = op;
      const {
        research_id: researchId,
        research_content_id: researchContentId,
        research_reference_id: referenceResearchId,
        research_content_reference_id: referenceResearchContentId
      } = payload;

      const outerRefResearch = await this.deipRpc.api.getResearchByIdAsync(researchId);
      const outerRefResearchGroup = await this.deipRpc.api.getResearchGroupByIdAsync(outerRefResearch.research_group_id);
      const outerRefResearchContent = await this.deipRpc.api.getResearchContentByIdAsync(researchContentId);

      const hash = outerRefResearchContent.content.split(':')[1];
      const ref = await this.researchContentService.getContentRefByHash(outerRefResearch.id, hash);

      const authorsProfiles = await this.usersService.getEnrichedProfiles(outerRefResearchContent.authors);

      acc.push({
        isOuter: true,
        refType: 'out',
        to: referenceResearchContentId,
        researchGroup: outerRefResearchGroup,
        research: outerRefResearch,
        researchContent: { ...outerRefResearchContent, authorsProfiles },
        ref,
        contentType: this.getResearchContentType(outerRefResearchContent.content_type)
      });

      await this.getResearchContentOuterReferences(outerRefResearchContent, acc);
    }
  }

  async getResearchContentInnerReferences(researchContent, acc) {
    const innerReferences = await this.deipRpc.api.getContentReferencesAsync(researchContent.id);

    for (let i = 0; i < innerReferences.length; i++) {
      const item = innerReferences[i];
      const {
        trx_id, block, timestamp, op
      } = item;
      const [opName, payload] = op;
      const {
        research_id: researchId,
        research_content_id: researchContentId,
        research_reference_id: referenceResearchId,
        research_content_reference_id: referenceResearchContentId
      } = payload;

      const innerRefResearch = await this.deipRpc.api.getResearchByIdAsync(referenceResearchId);
      const innerRefResearchGroup = await this.deipRpc.api.getResearchGroupByIdAsync(innerRefResearch.research_group_id);
      const innerRefResearchContent = await this.deipRpc.api.getResearchContentByIdAsync(referenceResearchContentId);

      const hash = innerRefResearchContent.content.split(':')[1];
      const ref = await this.researchContentService.getContentRefByHash(innerRefResearch.id, hash);

      const authorsProfiles = await this.usersService.getEnrichedProfiles(innerRefResearchContent.authors);

      acc.push({
        isInner: true,
        refType: 'in',
        to: researchContentId,
        researchGroup: innerRefResearchGroup,
        research: innerRefResearch,
        researchContent: { ...innerRefResearchContent, authorsProfiles },
        ref,
        contentType: this.getResearchContentType(innerRefResearchContent.content_type)
      });
      await this.getResearchContentInnerReferences(innerRefResearchContent, acc);
    }
  }

  async getResearchContentReferencesGraph(researchContentId) {
    const researchContent = await this.deipRpc.api.getResearchContentByIdAsync(researchContentId);
    const research = await this.deipRpc.api.getResearchByIdAsync(researchContent.research_id);
    const researchGroup = await this.deipRpc.api.getResearchGroupByIdAsync(research.research_group_id);

    const hash = researchContent.content.split(':')[1];
    const ref = await this.researchContentService.getContentRefByHash(research.id, hash);

    const authorsProfiles = await this.usersService.getEnrichedProfiles(researchContent.authors);

    const root = {
      isRoot: true,
      refType: 'root',
      researchContent: { ...researchContent, authorsProfiles },
      research,
      researchGroup,
      ref,
      contentType: this.getResearchContentType(researchContent.content_type)
    };

    const outerReferences = [];
    await this.getResearchContentOuterReferences(researchContent, outerReferences);

    const innerReferences = [];
    await this.getResearchContentInnerReferences(researchContent, innerReferences);

    const references = [...innerReferences, root, ...outerReferences];
    const nodes = references.reduce((acc, ref) => {
      if (acc.some((r) => r.researchContent.id === ref.researchContent.id)) {
        return acc;
      }
      return [...acc, ref];
    }, []);

    const links = [];
    for (let i = 0; i < references.length; i++) {
      const ref = references[i];

      if (ref.isRoot) continue;

      const type = ref.isOuter ? 'needs' : 'depends';

      const source = nodes.findIndex((node) => (ref.isOuter
        ? node.researchContent.id === ref.researchContent.id
        : node.researchContent.id === ref.to));

      const target = nodes.findIndex((node) => (ref.isOuter
        ? node.researchContent.id === ref.to
        : node.researchContent.id === ref.researchContent.id));

      const link = { source, target, type };

      links.push(link);
    }

    return { nodes, links };
  }

  getResearchContentType(type) {
    return researchContentTypes.find((t) => t.type === type);
  }

  getTopResearchesIds() {
    // return [ 21, 14, 24, 7, 10, 5, 0, 6, 26, 28, 15, 23, 9, 25, 20, 12 ];
    return [];
  }

  getResearch(researchId) {
    return this.researchHttp.getResearch(researchId);
  }

  updateResearch(researchId, milestones, videoSrc, partners, trl) {
    const update = {
      milestones,
      videoSrc,
      partners,
      trl
    };

    return this.researchHttp.updateResearch(researchId, update);
  }
}

export {
  ResearchService
};
