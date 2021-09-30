<template>
  <div class="d-flex">
    <div v-if="$slots.prepend" class="mr-6">
      <slot name="prepend" />
    </div>

    <template v-if="hasTitle">
      <div v-if="title || $slots.default" class="text-h3">
        <v-badge
          color="primary"
          offset-y="12"
          offset-x="0"
          :content="titleBadge"
          :value="Boolean(titleBadge)"
        >
          {{ title }}
        </v-badge>

        <slot />
      </div>

      <slot name="title" />
    </template>

    <v-spacer />

    <div v-if="$slots.append" class="ml-6">
      <slot name="append" />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'VexSectionTitle',
    props: {
      title: {
        type: [String],
        default: ''
      },
      titleBadge: {
        type: [String, Number],
        default: ''
      }
    },
    methods: {
      hasTitle() {
        return this.title || this.$slots.title;
      }
    }
  });
</script>
