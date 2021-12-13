import ProjectDto from './../../../../../base/rpc/response/dto/ProjectDto';
import { fromHexFormat } from './../../../utils';


class SubstrateProjectDto extends ProjectDto {

  constructor(project) {
    const projectId = fromHexFormat(project.externalId);
    const teamId = fromHexFormat(project.teamId);
    const metadata = fromHexFormat(project.description);
    const isPrivate = project.isPrivate;
    const domains = project.domains.map((domainId) => fromHexFormat(domainId));

    super({ 
      projectId,
      teamId,
      metadata,
      isPrivate,
      domains
    });

  }
  
}


export default SubstrateProjectDto;