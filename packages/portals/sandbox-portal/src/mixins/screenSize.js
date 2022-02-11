export const screenSize = {
  computed: {
    $$isDesktop() {
      return this.$vuetify.breakpoint.lgAndUp;
    },

    $$isTablet() {
      return this.$vuetify.breakpoint.mdOnly || this.$vuetify.breakpoint.smOnly;
    },

    $$isMobile() {
      return this.$vuetify.breakpoint.xs;
    },

    $$isMenuSmall() {
      return this.$vuetify.breakpoint.mdAndDown;
    }
  }
};
