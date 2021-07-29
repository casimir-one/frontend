<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <div class="builder">
        <v-navigation-drawer
          class="builder__nav"
          app
          permanent
          width="320"
        >
          <div
            class="d-flex fill-height"
          >
            <v-navigation-drawer
              mini-variant
              mini-variant-width="56"
              permanent
            >
              <v-list-item class="pl-4" @click="$router.back()">
                <v-list-item-icon>
                  <v-icon>mdi-arrow-left</v-icon>
                </v-list-item-icon>
                <v-list-item-content />
              </v-list-item>

              <v-list-item-group
                v-model="activeSide"
                color="primary"
              >
                <v-list-item value="add" class="pl-4">
                  <v-list-item-icon>
                    <v-icon>mdi-plus-box</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content />
                </v-list-item>

                <v-list-item value="tree" class="pl-4">
                  <v-list-item-icon>
                    <v-icon>mdi-file-tree-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content />
                </v-list-item>
              </v-list-item-group>
            </v-navigation-drawer>

            <v-divider vertical class="ma-0" />

            <v-navigation-drawer
              v-if="activeSide === 'add'"
              permanent
              class="spacer"
            >
              <template #prepend>
                <div class="text-h6 py-4 px-6">
                  Add
                </div>
                <v-divider />
              </template>

              <schema-builder-blocks-list
                :blocks="blocks"
                class="spacer"
              />
            </v-navigation-drawer>

            <v-navigation-drawer
              v-if="activeSide === 'tree'"
              permanent
              class="spacer"
            >
              <template #prepend>
                <div class="text-h6 py-4 px-6">
                  Navigate
                </div>
                <v-divider />
              </template>

              <schema-builder-canvas-tree
                ref="navigator"
                v-model="formData.schema"
                :blocks="blocks"
                class="pa-4"
              />
            </v-navigation-drawer>
          </div>
        </v-navigation-drawer>

        <v-navigation-drawer
          right
          class="builder__nav"
          app
          permanent
        >
          <template #prepend>
            <div class="text-h6 py-4 px-6">
              Settings
            </div>
            <v-divider />
          </template>
          <div class="pa-6">
            <schema-builder-block-settings
              ref="blockSettings"
              v-model="formData.schema"
              :blocks="blocks"
            />
          </div>
        </v-navigation-drawer>

        <div class="pa-6">
          <v-row>
            <v-col cols="9">
              <v-text-field v-model="formData.name" label="Schema name" hide-details="auto" />
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="formData.scope"
                label="Schema scope"
                :items="scopesList"
                hide-details="auto"
                :disabled="isEditMode"
              />
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="formData.isForm"
                label="Schema is form"
                class="ma-0 pa-0"
                hide-details="auto"
                :disabled="isEditMode"
              />
            </v-col>
            <v-col cols="12">
              <schema-builder-canvas
                ref="canvas"
                v-model="formData.schema"
                :blocks="blocks"
                watch-delete-key
              />
            </v-col>
          </v-row>
          <pre>{{ JSON.stringify(formData.schema, null, 2) }}</pre>
        </div>

        <v-btn
          color="primary"
          fixed
          bottom
          right
          fab
          type="submit"
          :style="{
            right: `${$vuetify.application.right + 24}px`,
            bottom: '24px'
          }"
          :disabled="disabled || untouched || invalid"
          :loading="loading"
        >
          <v-icon>mdi-content-save-outline</v-icon>
        </v-btn>
      </div>
    </v-form>
  </validation-observer>
</template>

<script>
  import { mapListFromEnum } from '@deip/toolbox';
  import { defineComponent } from '@deip/platform-util';
  import { formFactory } from '@deip/platform-components';

  import {
    SchemaBuilderBlocksList,
    SchemaBuilderCanvas,
    SchemaBuilderCanvasTree,
    SchemaBuilderBlockSettings
  } from '@deip/schema-builder';

  import { ATTR_SCOPES, ATTR_SCOPES_LABELS, FORM_MODES } from '@deip/constants';
  import { AttributeSet, AttributeRead } from '@deip/attributes-module';

  import {
    attributesBlocksFactory
  } from '../../blocks';

  import { LayoutsRegistry } from '../../registry';

  const layoutsRegistry = LayoutsRegistry.getInstance();

  export default defineComponent({
    name: 'LayoutBuilder',

    components: {
      SchemaBuilderBlocksList,
      SchemaBuilderCanvas,
      SchemaBuilderCanvasTree,
      SchemaBuilderBlockSettings
    },

    mixins: [
      formFactory(
        'layout',
        'input',
        () => ({
          name: '',
          scope: ATTR_SCOPES.PROJECT,
          schema: [],
          isForm: false
        })
      )
    ],

    data() {
      return {
        scopesList: mapListFromEnum(ATTR_SCOPES, ATTR_SCOPES_LABELS),

        activeSide: 'add',
        activeNode: null
      };
    },

    computed: {
      blocks() {
        return [
          ...layoutsRegistry.getBlocks(),
          attributesBlocksFactory(
            this.$store.getters['attributes/list']({ scope: this.formData.scope }),
            this.formData.isForm ? AttributeSet : AttributeRead
          )
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

      createLayout() {
        this.loading = true;

        return this.$store.dispatch(
          'layouts/create',
          this.lazyFormData
        )
          .then(() => {
            this.onSuccess();
          })
          .catch((err) => {
            this.onError(err);
          })
          .finally(() => {
            this.loading = false;
          });
      },

      updateLayout() {
        this.loading = true;

        return this.$store.dispatch(
          'layouts/update',
          this.lazyFormData
        )
          .then(() => {
            this.onSuccess();
          })
          .catch((err) => {
            this.onError(err);
          })
          .finally(() => {
            this.loading = false;
          });
      },

      onSubmit() {
        if (this.mode === FORM_MODES.CREATE) {
          this.createLayout();
        } else if (this.mode === FORM_MODES.EDIT) {
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
