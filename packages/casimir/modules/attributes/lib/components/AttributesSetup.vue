<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <v-form @submit.prevent="handleSubmit(updateSettings)">
      <ve-stack :gap="32">
        <ve-stack v-for="scope in scopes" :key="scope.type" :gap="24">
          <div class="text-h5">
            {{ scope.label }}
          </div>
          <v-row>
            <v-col
              v-for="el in scope.mappedKeys.attributes"
              :key="`${el.key}-selector`"
              cols="6"
            >
              <v-select
                :value="getMapValue(`${scope.type}.${el.key}`)"
                :label="el.label"
                :items="getKeyAttrsList(scope.type, el.allowedTypes)"
                :hint="`key: ${scope.type}.${el.key}`"
                persistent-hint
                @change="setMapValue(`${scope.type}.${el.key}`, $event)"
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

    computed: {
      scopes() {
        return this.$store.getters['scopesRegistry/list']();
      },

      attributes() {
        return this.$store.getters['attributes/list']();
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
        return this.$store.getters['attributesRegistry/one'](attr.type).icon;
      },

      getMapValue(elementKey) {
        const { mappedKeys = [] } = this.formData;
        return mappedKeys.find((el) => el.key === elementKey)?.value || '';
      },

      setMapValue(key, value) {
        const mappedKeys = collectionMerge(
          this.formData.mappedKeys || [],
          { key, value },
          { key: 'key' }
        );

        this.$set(this.formData, 'mappedKeys', mappedKeys);
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
