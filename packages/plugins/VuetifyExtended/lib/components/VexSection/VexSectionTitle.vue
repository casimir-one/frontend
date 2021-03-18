<template>
  <div class="d-flex">
    <div v-if="$slots.prepend" class="mr-6">
      <slot name="prepend" />
    </div>

    <template v-if="hasTitle">
      <div v-if="title" class="text-h3">
        {{ title }}

        <v-chip v-if="titleBadge" small color="primary" readonly>
          {{ titleBadge }}
        </v-chip>

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
  import { hasSlot } from '../../composables/context';

  export default {
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
        return this.title || this.$slots.title
      }
    }
  }
</script>
