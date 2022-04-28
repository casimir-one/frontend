import { PROJECT_CONTENT_TYPES } from '@deip/constants';

export const reviewsMixin = {
  methods: {
    $$getAssessmentCriterias(contentType) {
      let assesment = {};

      const currentPortal = this.$store.getters['currentPortal/data'];

      const assesmentInfo = currentPortal.profile.settings.assesmentCriterias
        .some((a) => a.contentType === contentType)
        ? currentPortal.profile.settings.assesmentCriterias
          .find((a) => a.contentType === contentType)
        : currentPortal.profile.settings.assesmentCriterias
          .find((a) => a.contentType === PROJECT_CONTENT_TYPES.UNKNOWN);

      assesment = assesmentInfo ? assesmentInfo.values.map((a) => ({ ...a })) : [];

      return assesment;
    }

  }
};
