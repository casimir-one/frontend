import Proxyable from 'vuetify/lib/mixins/proxyable';

export const defaultAttributeModel = () => ({
  blockchainFieldMeta: null,

  title: '',
  shortTitle: '',
  description: '',

  defaultValue: null,
  valueOptions: [],

  isFilterable: false,
  isMultiple: false,
  isRequired: false,
  isHidden: false
});

export const attributeEdit = {
  mixins: [Proxyable],
  created() {
    if (!this.internalValue._id) {
      this.internalValue = {
        ...this.internalValue,
        ...defaultAttributeModel()
      };
    }
  }
};
