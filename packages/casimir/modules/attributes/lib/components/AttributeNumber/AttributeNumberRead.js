import { AttributeReadMixin } from '../../mixins';

export const AttributeNumberRead = {
  name: 'AttributeNumberRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
};
