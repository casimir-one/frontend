export const contextMixin = {
  methods: {
    hasSlot() {
      return (name) => !!(this.$slots[name] || this.$scopedSlots[name])
    }
  }
}
