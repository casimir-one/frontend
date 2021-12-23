import { AttributeOptionsReadMixin, AttributeReadMixin } from '../../mixins';

export const AttributeSelectRead = {
  name: 'AttributeSelectRead',

  mixins: [
    AttributeReadMixin,
    AttributeOptionsReadMixin
  ],

  methods: {
    genAttribute() {
      return (
        <div>{this.optionsValueTitles.join(', ')}</div>
      );
    }
  }
};
