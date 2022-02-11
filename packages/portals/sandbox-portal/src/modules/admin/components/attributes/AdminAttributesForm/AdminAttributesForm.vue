<template>
  <vex-section max-width="800" class="mx-auto pa-0">
    <ve-stack :gap="32">
      <vex-section-title :title="title" />

      <attribute-edit
        v-if="ready"
        :mode="mode"
        :value="attributeData"
        @success="onSuccess"
        @error="onError"
      />
    </ve-stack>
  </vex-section>
</template>

<script>
  import { AttributeEdit } from '@deip/attributes-module';
  import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  import { VIEW_MODE } from '@deip/constants';

  export default {
    name: 'AdminAttributesForm',
    components: {
      AttributeEdit,
      VeStack,
      VexSection,
      VexSectionTitle
    },

    props: {
      attributeId: {
        type: String,
        default: null
      },

      mode: {
        type: Number,
        default: VIEW_MODE.CREATE,
        validator(value) {
          return [VIEW_MODE.CREATE, VIEW_MODE.EDIT].includes(value);
        }
      },

      title: {
        type: String,
        default: 'Create attribute'
      }
    },

    data() {
      return {
        ready: false
      };
    },

    computed: {
      attributeData() {
        return this.attributeId ? this.$store.getters['attributes/one'](this.attributeId) : null;
      }
    },

    created() {
      if (this.attributeId) {
        this.$store.dispatch('attributes/getOne', this.attributeId)
          .then(() => {
            this.ready = true;
          });
      } else {
        this.ready = true;
      }
    },

    methods: {
      onSuccess() {
        this.$notifier.showSuccess('Attribute saved successfully!');
        this.$router.push({ name: 'admin.attributes' });
      },

      onError(error) {
        this.$notifier.showError(error);
      }
    }
  };
</script>
