export function hasSlot() {
  return (name) => !!(this.$slots[name] || this.$scopedSlots[name])
}
