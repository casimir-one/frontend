import {
  VIcon
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';
import { VeStack } from '@deip/vue-elements';
import { defineComponent } from '@deip/platform-util';
import { AttributeReadMixin } from '../../mixins';

// TODO: move to toolbox?
const iconsMap = [
  { icon: 'mdi-file-image-outline', ext: ['jpg', 'jpeg', 'png', 'svg', 'bmp', 'gif'] },
  { icon: 'mdi-file-document-outline', ext: [] },
  { icon: 'mdi-file-excel-outline', ext: ['xlsx'] },
  { icon: 'mdi-file-table-outline', ext: [] },
  { icon: 'mdi-file-pdf-outline', ext: ['pdf'] },
  { icon: 'mdi-file-powerpoint-outline', ext: ['ppt', 'pptx'] }
];

const getFileIcon = (fileName) => {
  if (!fileName) return false;

  const target = iconsMap
    .find((item) => item.ext.includes(fileName.split('.').pop()));

  if (!target) return 'mdi-file-outline';

  return target.icon;
};

export const AttributeFileRead = defineComponent({
  name: 'AttributeFileRead',

  mixins: [AttributeReadMixin],

  methods: {
    genAttribute() {
      return (
        <VeStack gap={16}>
          <div class="d-flex">
            <VIcon size={20} class="mr-2">
              {getFileIcon(this.internalValue)}
            </VIcon>
            <a href={this.schemaData.getAttributeFileSrc(this.attributeId)}>{this.internalValue}</a>
          </div>
        </VeStack>
      );
    }
  }
});
