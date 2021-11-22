import { assert } from '@deip/toolbox';


class ProjectContentDto {

  constructor({
    contentId,
    projectId,
    type,
    authors,
    content,
    metadata,
    references,
    eciMap
  }) {

    assert(!!contentId, "Project content ID is not specified");
    assert(!!projectId, "Project ID is not specified");
    assert(!!type, "Project content 'type' is not specified");
    assert(!!authors && authors.length, "Project content 'authors' are not specified");
    assert(!!content, "Project content hash is not specified");

    this.contentId = contentId;
    this.projectId = projectId;
    this.type = type;
    this.authors = authors;
    this.content = content;
    this.metadata = metadata || null;
    this.references = references || [];
    this.eciMap = eciMap || {};

  }

}


export default ProjectContentDto;