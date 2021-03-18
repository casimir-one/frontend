export const dataReadyMixin = {
  data() {
    return {
      $$lazyDataReady: false
    };
  },
  computed: {
    $$ready: {
      get() {
        return this.$data.$$lazyDataReady;
      },
      set(val) {
        this.$data.$$lazyDataReady = val;
        this.$emit('data-ready', val);
      }
    }
  },
  methods: {
    $$setReady(state = true, cb) {
      this.$$ready = state;

      if (cb) {
        this.$nextTick(() => { cb(); });
      }
    }
  }
};
