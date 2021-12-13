<template>
  <div>
    <vex-file-input
      v-model="fileModel"
      :label="label"
      v-bind="attrs$"
      hide-details="auto"
    />

    <slot name="existList" :files="existsFiles">
      <vex-stack v-if="existsFiles && existsFiles.length" class="mt-2" :gutter="8">
        <div
          v-for="(file, index) of existsFiles"
          :key="`link-${index}`"
          class="d-flex align-center"
        >
          <v-icon size="16" class="mr-1">
            {{ fileIcon(file) }}
          </v-icon>
          <a
            :href="urlBuilder(file)"
            class="link text-caption text--secondary"
          >
            {{ file }}
          </a>
        </div>
      </vex-stack>
    </slot>
  </div>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  /* eslint-disable */
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  import { wrapInArray } from 'vuetify/lib/util/helpers';
  /* eslint-enable */

  import { VexFileInput } from '../VexFileInput';
  import { VexStack } from '../../VexStack';

  const iconsMap = [
    { icon: 'mdi-file-image-outline', ext: ['jpg', 'jpeg', 'png', 'svg', 'bmp', 'gif'] },
    { icon: 'mdi-file-document-outline', ext: [] },
    { icon: 'mdi-file-excel-outline', ext: ['xlsx'] },
    { icon: 'mdi-file-table-outline', ext: [] },
    { icon: 'mdi-file-pdf-outline', ext: ['pdf'] },
    { icon: 'mdi-file-powerpoint-outline', ext: ['ppt', 'pptx'] }
  ];

  export default defineComponent({
    name: 'VexFileInputExtended',
    components: { VexStack, VexFileInput },
    mixins: [Proxyable, BindsAttrs],
    props: {
      urlBuilder: {
        type: Function,
        default: (val) => val
      },
      label: {
        type: String,
        default: undefined
      }
    },
    data() {
      return {
        fileModel: undefined,
        existsFiles: undefined
      };
    },
    watch: {
      fileModel(files) {
        if (this.multiple) {
          this.internalValue = [
            ...this.existsFiles,
            ...wrapInArray(files)
          ];
        } else {
          this.internalValue = files || this.existsFiles[0];
        }
      }
    },
    created() {
      if (this.internalValue) {
        const exist = wrapInArray(this.internalValue);

        this.existsFiles = this.multiple
          ? exist
          : wrapInArray(exist[0]);

        // normalize not multiple value
        if (!this.multiple) {
          [this.internalValue] = exist;
        }
      } else {
        this.existsFiles = [];
      }
    },
    methods: {
      fileIcon(name) {
        if (!name) return false;

        const target = iconsMap
          .find((item) => item.ext.includes(name.split('.').pop()));

        if (!target) return 'mdi-file-outline';

        return target.icon;
      }
    }
  });
</script>
