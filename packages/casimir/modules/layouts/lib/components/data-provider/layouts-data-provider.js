export const LayoutsDataProvider = {
  name: 'LayoutsDataProvider',

  props: {
    layouts: {
      type: [Array, String],
      default: () => ([])
    },

    filterItems: {
      type: Object,
      default: () => ({})
    },

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
    getterFilter() {
      return this.filterItems;
    },

    dataList() {
      return this.$store.getters['layouts/list'](this.getterFilter);
    },

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
