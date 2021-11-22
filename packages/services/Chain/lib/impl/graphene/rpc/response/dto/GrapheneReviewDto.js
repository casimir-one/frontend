import ReviewDto from './../../../../../base/rpc/response/dto/ReviewDto';


class GrapheneReviewDto extends ReviewDto {

  constructor(review) {

    const reviewId = review.external_id;
    const sourceId = review.research_content_external_id;
    const content = review.content;
    const author = review.author;
    const domains = review.disciplines.map((discipline) => discipline.external_id);
    const isPositive = review.is_positive;
    const eciMap = review.expertise_tokens_amount_by_discipline;
    const type = review.assessment_model_v;

    let model;
    try {
      model = {
        scores: review.scores.reduce((m, score) => {
          const [key, value] = score;
          m[key] = value;
          return m;
        }, {})
      };
    } catch(err) {
      model = review.scores || {};
    }

    const assessment = { type, model };


    super({
      reviewId,
      sourceId,
      content,
      author,
      domains,
      assessment,
      isPositive,
      eciMap
    });
  }

}


export default GrapheneReviewDto;