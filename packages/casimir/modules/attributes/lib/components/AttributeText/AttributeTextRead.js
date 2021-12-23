import { VeLineClamp } from '@deip/vue-elements';
import { AttributeReadMixin } from '../../mixins';

export const AttributeTextRead = {
  name: 'AttributeTextRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VeLineClamp lines={this.proxyProps.VeLineClamp.lines}>
          {this.internalValue}
        </VeLineClamp>
      );
    }
  }
};
