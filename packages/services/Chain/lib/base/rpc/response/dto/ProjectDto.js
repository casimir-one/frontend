import { assert, isBoolean } from '@deip/toolbox';


class ProjectDto {

  constructor({
    projectId,
    teamId,
    metadata,
    isPrivate,
    isFinished,
    domains,
    positiveReviewCount,
    negativeReviewCount,
    projectContentCount,
    eciMap
  }) {
    
    assert(!!projectId, "Project ID is not specified");
    assert(!!teamId, "Team Dao ID is not specified");
    assert(isBoolean(isPrivate), "Project 'isPrivate' flag should be specified as boolean");

    this.teamId = teamId;
    this.projectId = projectId;
    this.isPrivate = isPrivate;
    this.metadata = metadata || "";
    this.isFinished = isFinished || false;
    this.domains = domains;
    this.positiveReviewCount = positiveReviewCount || 0;
    this.negativeReviewCount = negativeReviewCount || 0;
    this.projectContentCount = projectContentCount || 0;
    this.eciMap = eciMap || {};

  }

}


export default ProjectDto;
