import { AttributeReadMixin } from '../../mixins';

export const AttributeLocationRead = {
  name: 'AttributeLocationRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
};
