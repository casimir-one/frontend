/**
 * Component for layouts data provider
 */
export const LayoutsDataProvider = {
  name: 'LayoutsDataProvider',

  props: {
    /**
     * Layouts list or single layout
     */
    layouts: {
      type: [Array, String],
      default: () => ([])
    },
    /**
     * Filter for layouts
     */
    filterItems: {
      type: Object,
      default: () => ({})
    },
    /**
     * Tag name
     * @example 'div'
     */
    tag: {
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      loading: false,
      ready: false,
      disabled: false
    };
  },

  computed: {
    /**
     * Get computed filter for layouts
     */
    getterFilter() {
      return this.filterItems;
    },
    /**
     * Get computed filtered layouts
     */
    dataList() {
      return this.$store.getters['layouts/list'](this.getterFilter);
    },
    /**
     * Get computed slot properties
     */
    slotProps() {
      return {
        layouts: this.dataList,

        loading: this.loading,
        ready: this.ready,
        disabled: this.disabled
      };
    }
  },

  created() {
    this.loadData();
  },

  methods: {
    /**
     * Load layouts list
     */
    loadData() {
      this.loading = true;

      this.$store.dispatch('layouts/getList')
        .then(() => {
          this.loading = false;
          this.ready = true;

          this.$emit('ready', this.dataList);
        });
    }
  },
  render(h) {
    return h(this.tag, [
      this.$scopedSlots.default(this.slotProps)
    ]);
  }
};
