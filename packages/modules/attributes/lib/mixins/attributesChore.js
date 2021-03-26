export const attributesChore = {
  computed: {
    $$tenantAttributes() {
      return []; // TODO: replace later with store getter
    }
  },
  methods: {
    $$getAttributeInfo(id, attributes = this.$$tenantAttributes) {
      return attributes.find((a) => a._id === id);
    }
  }
};
