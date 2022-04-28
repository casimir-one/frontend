/* eslint-disable max-len */
export default {
  module: {
    reviews: {
      reviewsList: {
        reviews: 'Reviews',
        reviewsList: 'Reviews list',
        assessment: 'Assessment',
        expertsSupp: '{supportersCount} experts supported this review'
      },
      reviewRequest: {
        request: 'Request expert review',
        selectContent: 'Select a content to request review',
        selectExpert: 'Select expert',
        cancel: 'Cancel',
        confirm: 'Confirm'
      },
      create: {
        project: 'Project',
        subject: 'Subject',
        reviewOn: ' Review on {title}',
        question: 'Question {number}',
        cancel: 'Cancel',
        publish: 'Publish',
        reject: 'Reject',
        accept: 'Accept review invitation',
        answer: 'Your answer',
        switchLabel: 'Declare no competing interests exist',
        modal: {
          title: 'Create review',
          buttonText: 'Select',
          select: 'Select content'
        }
      },
      details: {
        question: 'Question'
      },
      vote: {
        notMembers: 'Review can be supported only by members who have no relations with this project or team that leads this project.',
        suppRev: 'Support Review',
        canSupport: 'Users with expertise in {domains} can support this review',
        once: 'Review can be supported once by the user',
        reviewedAlready: 'You have reviewed this material already',
        request: 'Request expert review',
        notSuppOwnRev: 'It\'s not allowed to support your own review',
        needNotMembers: 'To add review you need to have no relations with this {project} or team that leads this {project}.',
        success: 'Review supported',
        error: 'An error occured, please try again later'
      }
    }
  }
};
