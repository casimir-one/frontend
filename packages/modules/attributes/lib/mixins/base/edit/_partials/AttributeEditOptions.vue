<template>
  <d-block small :title="label">
    <d-timeline>
      <d-timeline-item
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
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </d-timeline-item>
      <d-timeline-add @click="addItem()" />
    </d-timeline>
  </d-block>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { arrayModelAddFactory } from '@/mixins/extendModel';

  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DTimelineAdd from '@/components/Deipify/DTimeline/DTimelineAdd';
  import DTimelineItem from '@/components/Deipify/DTimeline/DTimelineItem';
  import AttributeEditMeta from '@/components/Attributes/_mixins/edit/_partials/AttributeEditMeta';
  import DTimeline from '@/components/Deipify/DTimeline/DTimeline';

  const optModelFactory = () => ({
    label: undefined,
    url: undefined
  });

  export default {
    name: 'AttributeEditOptions',
    components: {
      DTimeline,
      AttributeEditMeta,
      DTimelineItem,
      DTimelineAdd,
      DBlock
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
