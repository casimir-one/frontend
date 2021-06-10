<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <v-form @submit.prevent="handleSubmit(updateSettings)">
      <vex-stack gutter="32">
        <v-row>
          <v-col>
            <v-card outlined>
              <v-card-title class="py-4">
                Globals map
              </v-card-title>
              <v-divider />
              <template v-for="(item, index) of formData.map">
                <v-row :key="index" class="pa-4">
                  <v-col cols="3">
                    <v-text-field v-model="item.key" hide-details disabled />
                  </v-col>
                  <v-col class="d-flex">
                    <v-sheet class="spacer d-flex" outlined rounded>
                      <draggable
                        class="attr-map-target spacer align-center d-flex px-2"
                        :list="lazyMap"
                        :group="{ name: 'blocks' }"
                        @change="onMapUpdate(index, $event)"
                      >
                        <v-chip
                          v-if="item.value"
                          close
                          label
                          @click:close="item.value = ''"
                        >
                          {{ getAttrTitle(item.value) }}
                        </v-chip>
                      </draggable>
                    </v-sheet>
                  </v-col>
                </v-row>
                <v-divider :key="`dv-${index}`" />
              </template>

              <div class="v-card__actions">
                <v-btn
                  text
                  small
                  color="primary"
                  @click="addMapKey()"
                >
                  Add key
                </v-btn>
              </div>
            </v-card>
          </v-col>

          <v-col cols="4" class="d-flex flex-column">
            <v-sheet outlined rounded min-height="100%">
              <v-tabs
                v-model="activeMap"
                class="px-2"
                background-color="transparent"
                height="56"
              >
                <v-tab v-for="(scope, index) of attributes" :key="index">
                  {{ scope.title }}
                </v-tab>
              </v-tabs>
              <v-divider />
              <v-tabs-items v-model="activeMap" style="background: transparent">
                <v-tab-item

                  v-for="(scope, index) of attributes"
                  :key="index"
                >
                  <draggable
                    :list="scope.attrs"
                    class="px-1 py-4"
                    :group="{ name: 'blocks', pull: 'clone', put: false }"
                    :sort="false"
                    :clone="onMapClone"
                  >
                    <div
                      v-for="block of scope.attrs"
                      :key="block._id"
                      class="text-body-2 px-5 py-2"
                    >
                      {{ block.title }}
                    </div>
                  </draggable>
                </v-tab-item>
              </v-tabs-items>
            </v-sheet>
          </v-col>
        </v-row>

        <v-divider />

        <div class="d-flex">
          <v-spacer />
          <v-btn
            color="primary"
            text
            :disabled="loading || disabled"
            @click="$router.back()"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            :disabled="disabled || untouched || invalid"
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </vex-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { isEqual } from 'lodash/fp';
  import { AttributedForm } from '@deip/platform-fns';
  import { VexStack } from '@deip/vuetify-extended';
  import draggable from 'vuedraggable';
  import { ATTR_SCOPES, ATTR_SCOPES_LABELS } from '@deip/attributes-service';

  const defaultKeys = [
    'userAvatar',
    'userFirstName',
    'userLastName',

    'teamLogo',
    'teamTitle'
  ];

  const defaultData = () => ({
    map: defaultKeys.map((key) => ({
      key,
      value: ''
    }))
  });

  export default {
    name: 'AttributesSetup',

    components: {
      VexStack,
      draggable
    },

    model: {
      prop: 'value',
      event: 'input'
    },

    props: {
      value: {
        type: Object,
        default: () => defaultData()
      }
    },

    data(vm) {
      return {
        lazyFormData: vm.value,

        disabled: false,
        loading: false,

        oldValue: null,

        lazyMap: [],
        activeMap: 0
      };
    },

    computed: {
      formData: {
        get() {
          return this.lazyFormData;
        },
        set(val) {
          if (isEqual(val, this.lazyFormData)) return;
          this.lazyFormData = val;

          this.$emit('input', val);
        }
      },

      untouched() {
        return AttributedForm.computed.untouched.call(this);
      },

      attributes() {
        return ATTR_SCOPES.values().map((scope) => ({
          title: ATTR_SCOPES_LABELS[scope],
          attrs: this.$store.getters['attributes/list']({ scope })
        }));
      }
    },

    watch: {
      value: {
        ...AttributedForm.watch.value,
        ...{
          handler(val) {
            AttributedForm.watch.value.handler.call(this, val);
          }
        }
      }
    },

    created() {
      AttributedForm.created.call(this);
    },

    methods: {
      onMapClone(e) {
        return e._id;
      },
      onMapUpdate(index, e) {
        this.lazyMap = [];
        this.lazyFormData.map[index].value = e.added.element;
      },

      getAttrTitle(id) {
        return this.$store.getters['attributes/one'](id).title;
      },

      addMapKey() {
        this.formData.map.push({ key: '', value: '' });
      },

      removeMapKey(index) {
        this.formData.map.splice(index, 1);
      },

      updateSettings() {
        this.disabled = true;
        this.loading = true;

        this.$store.dispatch('attributes/updateSettings', this.lazyFormData)
          .then(() => {
            this.$emit('success');
          })
          .catch((error) => {
            this.$emit('error', error);
          })
          .finally(() => {
            this.disabled = false;
            this.loading = false;
          });
      }
    }
  };
</script>

<style lang="scss">
  .attr-map-target {
    position: relative;

    .sortable-ghost {
      position: absolute;
      background: rgba(#fff, .8);
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 12px !important;
    }
  }
</style>
