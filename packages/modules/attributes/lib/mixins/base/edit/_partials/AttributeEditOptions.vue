<template>
  <vex-block small :title="label">
    <vex-timeline>
      <vex-timeline-item
        v-for="(item, index) of internalValue"
        :key="`row-${index}`"
        :dot-top="16"
        :ctrl-height="48"
      >
        <template #dot>
          <slot name="dot" :option="item" :index="index" />
        </template>

        <attribute-edit-meta
          v-model="internalValue[index]"
          :field-label-key="fieldLabelKey"
          :class="{ 'mb-6': index + 1 < internalValue.length }"
        />

        <template #action>
          <v-btn icon :disabled="!index" @click="removeItem(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </vex-timeline-item>
      <vex-timeline-add @click="addItem()" />
    </vex-timeline>
  </vex-block>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { arrayModelAddFactory } from '@deip/platform-fns';

  import { 
    VexBlock, 
    VexTimeline, 
    VexTimelineItem, 
    VexTimelineAdd 
  } from '@deip/vuetify-extended';
  import AttributeEditMeta from './AttributeEditMeta';

  const optModelFactory = () => ({
    label: undefined,
    url: undefined
  });

  export default {
    name: 'AttributeEditOptions',
    components: {
      AttributeEditMeta,
      VexBlock,
      VexTimeline,
      VexTimelineItem,
      VexTimelineAdd
    },
    mixins: [Proxyable, arrayModelAddFactory(optModelFactory)],
    props: {
      label: {
        type: String,
        default: 'Options'
      },
      fieldLabelKey: {
        type: String,
        default: 'Option'
      }
    },
    created() {
      if (!this.internalValue.length) {
        this.addItem();
      }
    }
  };
</script>
