<template>
  <validation-observer
    v-slot="{ invalid }"
    tag="div"
    class="d-flex"
  >
    <vls-builder
      :value="formData.schema"
      :blocks="blocks"
      :disabled="invalid || loading"
      :loading="loading"
      class="flex-grow-1"
      @submit="handleBuilderSubmit"
    >
      <template #toggle>
        <v-list-item class="pl-4" @click="$router.back()">
          <v-list-item-icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-list-item-icon>
          <v-list-item-content />
        </v-list-item>
      </template>

      <v-row class="mb-4">
        <v-col cols="9">
          <validation-provider
            v-slot="{ errors }"
            name="Schema name"
            rules="required"
          >
            <v-text-field
              v-model="formData.name"
              label="Schema name"
              hide-details="auto"
              :error-messages="errors"
            />
          </validation-provider>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="formData.scope"
            label="Schema scope"
            :items="scopesSelector"
            hide-details="auto"
            :disabled="isEditMode"
          />
        </v-col>
        <v-col cols="12">
          <v-switch
            v-model="formData.type"
            false-value="details"
            true-value="form"
            label="Schema is form"
            class="ma-0 pa-0"
            hide-details="auto"
            :disabled="isEditMode"
          />
        </v-col>
      </v-row>
    </vls-builder>
  </validation-observer>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { formFactory } from '@deip/platform-components';

  import {
    VlsBuilder
  } from '@deip/vue-layout-schema';

  import { VIEW_MODE } from '@deip/constants';
  import { AttributeSet, AttributeRead } from '@deip/attributes-module';

  import {
    attributesBlocksFactory
  } from '../../blocks';

  export default defineComponent({
    name: 'LayoutBuilder',

    components: {
      VlsBuilder
    },

    mixins: [
      formFactory(
        'layout',
        'input',
        () => ({
          name: '',
          scope: 'project',
          schema: [],
          type: 'details'
        })
      )
    ],

    data() {
      return {
        activeSide: 'add',
        activeNode: null
      };
    },

    computed: {
      registryAttrList() {
        return this.$store.getters['attributesRegistry/list']();
      },

      registryScopesList() {
        return this.$store.getters['scopesRegistry/list']();
      },

      scopesSelector() {
        return this.registryScopesList
          .map((scope) => ({ text: scope.label, value: scope.type }));
      },

      blocks() {
        return [
          ...this.$store.getters['layoutsRegistry/blocks'],
          attributesBlocksFactory({
            attributes: this.$store.getters['attributes/list']({ scope: this.formData.scope }),
            component: this.formData.isForm ? AttributeSet : AttributeRead,
            registry: this.registryAttrList || []
          })
        ];
      }
    },

    methods: {
      reset() {
        this.formData.schema = [];
      },

      onSuccess() {
        this.$emit('success', this.lazyFormData);
      },

      onError(err) {
        this.$emit('error', err);
      },

      async createLayout() {
        this.loading = true;

        try {
          await this.$store.dispatch('layouts/create', this.lazyFormData);
          this.onSuccess();
        } catch (err) {
          this.onError(err);
        }

        this.loading = false;
      },

      async updateLayout() {
        this.loading = true;

        try {
          await this.$store.dispatch('layouts/update', this.lazyFormData);
          this.onSuccess();
        } catch (err) {
          this.onError(err);
        }

        this.loading = false;
      },

      handleBuilderSubmit(schema) {
        this.formData.schema = schema;

        if (this.mode === VIEW_MODE.CREATE) {
          this.createLayout();
        } else if (this.mode === VIEW_MODE.EDIT) {
          this.updateLayout();
        }
      }
    }
  });
</script>

<style lang="scss" scoped>
  .builder {
    &__nav {
      &::v-deep > .v-navigation-drawer__border {
        width: 1px;
      }
    }

    &__bar {
      border-bottom: 1px solid;
    }
  }
</style>
