import { AttributeReadMixin } from '../../mixins';

export const AttributeDateTimeRead = {
  name: 'AttributeDateTimeRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <div>{this.internalValue.split('T').join(' ')}</div>
      );
    }
  }
};
