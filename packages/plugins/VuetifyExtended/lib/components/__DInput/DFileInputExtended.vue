<template>
  <div>
    <d-file-input
      v-model="fileModel"
      :label="label"
      v-bind="attrs$"
      hide-details="auto"
    />
    <slot name="existList" :files="existsFiles">
      <d-stack v-if="existsFiles && existsFiles.length" class="mt-2" :gap="8">
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
      </d-stack>
    </slot>
  </div>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  import { filesChore } from '@/mixins/chores';

  import { wrapInArray } from 'vuetify/lib/util/helpers';

  import DFileInput from '@/components/Deipify/DInput/DFileInput';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'DFileInputExtended',
    components: { DStack, DFileInput },
    mixins: [Proxyable, BindsAttrs, filesChore],
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
    }
  };
</script>
