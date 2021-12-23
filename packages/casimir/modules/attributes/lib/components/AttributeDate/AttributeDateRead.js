import { AttributeReadMixin } from '../../mixins';

export const AttributeDateRead = {
  name: 'AttributeDateRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
};
