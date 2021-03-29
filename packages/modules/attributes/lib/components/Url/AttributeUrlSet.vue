<template>
  <vex-block>
    <template #title>
      {{ attribute.title }}
      <span v-if="!$$isRequired" class="text-body-2 text--secondary">(optional)</span>
    </template>
    <vex-timeline>
      <vex-timeline-item
        v-for="(item, index) of internalValue"
        :key="`row-${index}`"
        :dot-top="16"
        :ctrl-height="48"
      >
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="item.label"
              label="Label"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="item.url"
              label="URL"
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>

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

  import { 
    VexBlock, 
    VexTimeline, 
    VexTimelineItem, 
    VexTimelineAdd 
  } from '@deip/vuetify-extended';
  import { arrayModelAddFactory } from '@deip/platform-fns';
  import { attributeSet } from '../../mixins/base';

  const attrModelFactory = () => ({
    label: undefined,
    url: undefined
  });

  export default {
    name: 'AttributeUrlSet',

    components: {
      VexBlock, 
      VexTimeline, 
      VexTimelineItem, 
      VexTimelineAdd 
    },

    mixins: [attributeSet, arrayModelAddFactory(attrModelFactory)],
    created() {
      this.addStartItem();
    }
  };
</script>
