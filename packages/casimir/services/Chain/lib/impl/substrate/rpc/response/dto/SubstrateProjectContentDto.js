import ProjectContentDto from './../../../../../base/rpc/response/dto/ProjectContentDto';
import { fromHexFormat } from './../../../utils';
import { RESEARCH_CONTENT_TYPES } from '@deip/constants';
import { snakeCase } from 'change-case';


class SubstrateProjectContentDto extends ProjectContentDto {

  constructor(content) {

    const contentId = fromHexFormat(content.externalId);
    const projectId = fromHexFormat(content.projectExternalId);
    const type = RESEARCH_CONTENT_TYPES[snakeCase(content.contentType).toUpperCase()];
    const authors = content.authors.map((author) => author.daoId ? fromHexFormat(author.daoId) : author.address);
    const hash = fromHexFormat(content.content);
    const metadata = fromHexFormat(content.description);
    const references = content.references.map((reference) => fromHexFormat(reference));

    super({
      contentId,
      projectId,
      type,
      authors,
      content: hash,
      metadata,
      references
    });

  }

}


export default SubstrateProjectContentDto;