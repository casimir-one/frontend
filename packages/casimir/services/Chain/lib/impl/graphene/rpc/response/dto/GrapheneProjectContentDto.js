import ProjectContentDto from './../../../../../base/rpc/response/dto/ProjectContentDto';


class GrapheneProjectContentDto extends ProjectContentDto {

  constructor(content) {

    const contentId = content.external_id;
    const projectId = content.research_external_id;
    const type = content.content_type;
    const authors = content.authors;
    const hash = content.content;
    const metadata = content.description;
    const references = content.references;
    const eciMap = content.eci_per_discipline;

    super({ 
      contentId,
      projectId,
      type,
      authors,
      content: hash,
      metadata,
      references,
      eciMap
    });
    
  }

}


export default GrapheneProjectContentDto;