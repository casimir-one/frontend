<template>
  <layout-builder
    :layout="layoutData"
    :mode="mode"
    @success="onSuccess"
    @error="onError"
  />
</template>

<script>
  import { LayoutBuilder } from '@deip/layouts-module';
  import { formMixin } from '@deip/platform-components';
  import { filterObjectKeys } from '@deip/toolbox';

  export default {
    name: 'AdminLayoutsForm',

    components: {
      LayoutBuilder
    },

    props: {
      layoutId: {
        type: String,
        default: null
      },

      ...filterObjectKeys(formMixin.props, ['mode'])
    },

    computed: {
      layoutData() {
        return this.layoutId ? this.$store.getters['layouts/one'](this.layoutId) : undefined;
      }
    },

    methods: {
      onSuccess() {
        // const { _id: layoutId } = e;
        this.$notifier.showSuccess('Layout created');
        this.$router.push({ name: 'admin.layouts' });
      },

      onError(error) {
        this.$notifier.showError(error);
      }
    }
  };
</script>
