export const vuetyfyOverride = {
  methods: {
    setLabelWidth() {
      if (!this.outlined) return;
      this.labelWidth = this.$refs.label
        ? Math.min(this.$refs.label.scrollWidth * (12 / 14) + 6, this.$el.offsetWidth - 24)
        : 0;
    }
  }
};
