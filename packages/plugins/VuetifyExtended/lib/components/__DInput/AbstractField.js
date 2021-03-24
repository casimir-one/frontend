import Proxyable from 'vuetify/lib/mixins/proxyable';

export const AbstractField = {
  mixins: [Proxyable],
  props: {
    label: {
      type: String,
      default: null
    },
    xProps: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    _xProps() {
      return {
        outlined: true,
        hideDetails: 'auto',
        ...this.xProps
      };
    }
  }
};
