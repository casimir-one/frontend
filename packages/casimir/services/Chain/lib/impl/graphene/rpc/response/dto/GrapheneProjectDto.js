import ProjectDto from './../../../../../base/rpc/response/dto/ProjectDto';


class GrapheneProjectDto extends ProjectDto {

  constructor(project) {
    const projectId = project.external_id;
    const teamId = project.research_group.external_id;
    const metadata = project.description;
    const isPrivate = project.is_private;
    const isFinished = project.is_finished;
    const domains = project.disciplines.map((discipline) => discipline.external_id);
    const positiveReviewCount = project.number_of_positive_reviews;
    const negativeReviewCount = project.number_of_negative_reviews;
    const projectContentCount = project.number_of_research_contents;
    const eciMap = project.eci_per_discipline;

    super({ 
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
    });
    
  }

}


export default GrapheneProjectDto;