import { AttributeReadMixin, AttributeOptionsReadMixin } from '../../mixins';

export const AttributeSwitchRead = {
  name: 'AttributeSwitchRead',

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
