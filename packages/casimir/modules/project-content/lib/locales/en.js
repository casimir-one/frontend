export default {
  module: {
    projectContent: {
      types: {
        ANNOUNCEMENT: 'Announcement',
        FINAL_RESULT: 'Final Result',
        MILESTONE_ARTICLE: 'Article',
        MILESTONE_BOOK: 'Book',
        MILESTONE_CHAPTER: 'Chapter',
        MILESTONE_CODE: 'Code',
        MILESTONE_CONFERENCE_PAPER: 'Conference paper',
        MILESTONE_COVER_PAGE: 'Cover page',
        MILESTONE_DATA: 'Data',
        MILESTONE_EXPERIMENT_FINDINGS: 'Experiment findings',
        MILESTONE_METHOD: 'Method',
        MILESTONE_NEGATIVE_RESULTS: 'Negative results',
        MILESTONE_PATENT: 'Patent',
        MILESTONE_POSTER: 'Poster',
        MILESTONE_PREPRINT: 'Preprint',
        MILESTONE_PRESENTATION: 'Presentation',
        MILESTONE_RAW_DATA: 'Raw data',
        MILESTONE_NFT_COLLECTION_PROPOSAL: 'Nft collection proposal',
        MILESTONE_TECHNICAL_REPORT: 'Technical report',
        MILESTONE_THESIS: 'Thesis'
      },
      form: {
        title: 'Title',
        type: 'Material type',
        formatType: 'Format type',
        authors: 'Authors',
        references: 'References to material posted on platform',
        file: 'File',
        contentPlaceholder: 'Start typing here...',
        text: 'Text',
        package: 'Package',
        cancel: 'Cancel',
        upload: 'Upload',
        update: 'Update',
        create: 'Create'
      },
      contentList: {
        type: 'Type',
        title: 'Title'
      },
      draftList: {
        draft: 'Draft',
        type: 'Type',
        title: 'Title',
        proposed: 'proposed'
      },
      draft: {
        confirmDelete: {
          title: 'Delete content draft',
          message: 'Are you sure you want to delete content draft "{title}"? This action is irreversible.'
        },
        confirmPublish: {
          title: 'Publish content',
          message: 'Are you sure you want to publish content draft "{title}"? You won\'t be able to edit it.'
        },
        delete: 'Delete',
        edit: 'Edit',
        publish: 'Publish'
      },
      details: {
        authors: 'Authors',
        download: 'Download'
      }
    }
  }
};
