<template>
  <vex-block
    :title="$t('module.crowdfunding.createForm.titleBlock')"
    compact
  >
    <v-text-field
      v-model="internalTitle"
      :label="$t('module.crowdfunding.createForm.title')"
      hide-details="auto"
    />
  </vex-block>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VexBlock } from '@deip/vuetify-extended';

  export default defineComponent({
    name: 'CrowdfundingTitleInput',

    components: { VexBlock },

    model: {
      prop: 'title',
      event: 'change'
    },

    props: {
      title: {
        type: String,
        default: null
      }
    },

    computed: {
      internalTitle: {
        get() {
          return this.title;
        },
        set(value) {
          this.$emit('change', value);
        }
      }
    }
  });
</script>
