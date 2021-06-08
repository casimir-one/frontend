<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <v-form @submit.prevent="handleSubmit(updateSettings)">
      <vex-stack gutter="32">
        <div>{{ formData.map }}</div>

        <div class="text-subtitle-1">
          Attributes global map
        </div>

        <div>
          <template v-for="(item, index) of formData.map">
            <v-row :key="index">
              <v-col cols="3">
                <v-text-field v-model="item.key" hide-details disabled />
              </v-col>
              <v-col>
                <v-text-field v-model="item.value" hide-details />
              </v-col>
              <!--              <v-col cols="auto" class="px-3 py-4">-->
              <!--                <v-btn icon small @click="removeMapKey(index)">-->
              <!--                  <v-icon>mdi-close</v-icon>-->
              <!--                </v-btn>-->
              <!--              </v-col>-->
            </v-row>
          </template>
          <v-btn
            text
            small
            color="primary"
            @click="addMapKey()"
          >
            Add key
          </v-btn>
        </div>

        <v-divider />

        {{ disabled }} {{ untouched }} {{ invalid }}
        <div class="d-flex">
          <v-spacer />
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

  const defaultKeys = [
    'userAvatar',
    'userFirstName',
    'userLastName',

    'teamLogo'
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
      VexStack
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

        oldValue: null
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
      addMapKey() {
        this.formData.map.push({ key: '', value: '' });
      },

      removeMapKey(index) {
        this.formData.map.splice(index, 1);
      },

      updateSettings() {
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
