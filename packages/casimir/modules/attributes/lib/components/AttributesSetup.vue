<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <v-form @submit.prevent="handleSubmit(updateSettings)">
      <ve-stack :gap="32">
        <ve-stack v-for="scope in registryScopes" :key="scope.type" :gap="24">
          <div class="text-h5">
            {{ scope.label }}
          </div>
          <v-row>
            <v-col
              v-for="el in scope.mappedKeys"
              :key="`${el.key}-selector`"
              cols="6"
            >
              <v-select
                :value="getMapValue(`${scope.type}.${el.key}`)"
                :label="el.label"
                :items="getKeyAttrsList(scope.type, el.allowedTypes)"
                :hint="`key: ${scope.type}.${el.key}`"
                persistent-hint
                @change="setSystemMapValue(`${scope.type}.${el.key}`, $event)"
              >
                <template #item="{ item }">
                  <div class="d-flex">
                    <v-icon class="mr-4">
                      {{ getAttributeIcon(item.value) }}
                    </v-icon>
                    <v-spacer>{{ item.text }}</v-spacer>
                  </div>
                </template>

                <template #selection="{ item }">
                  <div class="d-flex align-center">
                    <v-icon class="mr-4">
                      {{ getAttributeIcon(item.value) }}
                    </v-icon>
                    <v-spacer>{{ item.text }}</v-spacer>
                  </div>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </ve-stack>

        <v-divider />

        <ve-stack :gap="24">
          <div class="text-h5">
            Custom keys
          </div>
          <ve-stack :gap="10">
            <v-row
              v-for="(mapItem, index) of customMapItems"
              :key="index"
              no-gutters
            >
              <v-col
                cols="4"
                style="margin-right: -1px;"
              >
                <validation-provider
                  v-slot="{ errors }"
                  :rules="`excluded:${getKeyExclusionList(mapItem)}`"
                  name="Key name"
                >
                  <v-text-field
                    v-model="mapItem.key"
                    label="Key name"
                    :error-messages="errors"
                    class="rounded-br-0 rounded-tr-0"
                  />
                </validation-provider>
              </v-col>
              <v-col>
                <v-select
                  v-model="mapItem.value"
                  label="Mapped attribute"
                  :items="attributesSelectorItems"
                  hide-details
                  class="rounded-bl-0 rounded-tl-0"
                >
                  <template #item="{ item }">
                    <div class="d-flex">
                      <v-icon class="mr-4">
                        {{ getAttributeIcon(item.value) }}
                      </v-icon>
                      <v-spacer>{{ item.text }}</v-spacer>
                    </div>
                  </template>

                  <template #selection="{ item }">
                    <div class="d-flex align-center">
                      <v-icon class="mr-4">
                        {{ getAttributeIcon(item.value) }}
                      </v-icon>
                      <v-spacer>{{ item.text }}</v-spacer>
                    </div>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="1" class="d-flex justify-end">
                <v-btn
                  icon
                  @click="handleRemoveKeyBtnClick(mapItem)"
                >
                  <v-icon dark>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <div>
              <v-btn
                outlined
                small
                color="primary"
                @click="addMapKey"
              >
                Add key
              </v-btn>
            </div>
          </ve-stack>
        </ve-stack>

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
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { formMixin } from '@deip/platform-components';
  import { VeStack } from '@deip/vue-elements';
  import { collectionMerge } from '@deip/toolbox';

  export default {
    name: 'AttributesSetup',

    components: {
      VeStack
    },

    mixins: [formMixin],

    props: {
      value: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        innerMap: {},
        testArray: []
      };
    },

    computed: {
      registryScopes() {
        return this.$store.getters['attributesRegistry/scopesList']();
      },

      attributes() {
        return this.$store.getters['attributes/list']();
      },

      attributesSelectorItems() {
        return this.attributes
          .map((attr) => ({
            text: attr.title,
            value: attr._id
          }));
      },

      defaultMapKeys() {
        return this.registryScopes
          .reduce((acc, scope) => [
            ...acc,
            ...scope.mappedKeys.map((el) => `${scope.type}.${el.key}`)
          ], []);
      },

      customMapItems() {
        return this.formData.map
          .filter((el) => !el.isSystem);
      }
    },

    methods: {
      getKeyAttrsList(scope, types) {
        return this.attributes
          .filter((attr) => attr.scope === scope && types.includes(attr.type))
          .map((attr) => ({
            text: attr.title,
            value: attr._id
          }));
      },
      getAttributeIcon(id) {
        const attr = this.attributes.find((a) => a._id === id);
        return this.$store.getters['attributesRegistry/attrOne'](attr.type).icon;
      },

      getMapValue(elementKey) {
        return this.formData.map.find((el) => el.key === elementKey)?.value || '';
      },

      setSystemMapValue(key, value) {
        this.formData.map = collectionMerge(
          this.formData.map,
          { key, value, isSystem: true },
          { key: 'key' }
        );
      },

      getKeyExclusionList(item) {
        const customKeys = this.formData.map
          .filter((el) => el !== item)
          .map((el) => el.key);

        return [...this.defaultMapKeys, ...customKeys];
      },

      isCustomKey(key) {
        return !this.defaultMapKeys.includes(key);
      },

      addMapKey() {
        this.formData.map.push({
          key: '',
          value: '',
          isSystem: false
        });
      },

      removeMapItem(item) {
        const index = this.formData.map.indexOf(item);
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
      },
      /**
       * @param {Object} item item index
       */
      handleRemoveKeyBtnClick(item) {
        this.removeMapItem(item);
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
