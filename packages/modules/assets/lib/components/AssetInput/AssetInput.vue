<template>
  <v-row no-gutters>
    <v-col
      cols="auto"
      class="spacer"
      style="margin-right: -1px;"
    >
      <validation-provider
        ref="amountValidator"
        v-slot="{ errors }"
        :name="$t('module.assets.input.amount')"
        :rules="required ? 'required|number' : 'number'"
      >
        <v-text-field
          v-model="internalValue.amount"
          class="rounded-br-0 rounded-tr-0"
          :label="label"
          outlined
          hide-details="auto"
          :error-messages="[...errors, ...errorMessages]"
          :name="$t('module.assets.input.amount')"
          autocomplete="off"
        />
      </validation-provider>
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="internalValue.symbol"
        class="rounded-bl-0 rounded-tl-0"
        :items="assetsListKeys"
        :hide-details="true"
        :disabled="disableAssets"
        outlined
      />
    </v-col>
  </v-row>
</template>

<script>
  import { isEqual } from '@deip/toolbox/lodash';

  import { assetsMixin } from '../../mixins';

  export default {
    name: 'AssetInput',

    mixins: [assetsMixin],

    model: {
      prop: 'value',
      event: 'change'
    },

    props: {
      value: {
        type: Object,
        default() { return {}; }
      },
      label: {
        type: String,
        default: null
      },
      required: {
        type: Boolean,
        default: false
      },
      disableAssets: {
        type: Boolean,
        default: false
      },
      assetsFilter: {
        type: Object,
        default() { return {}; }
      },
      errorMessages: {
        type: Array,
        default: () => ([])
      }

    },

    data() {
      const model = {
        id: undefined,
        amount: undefined,
        symbol: this.$env.ASSET_UNIT,
        precision: undefined
      };

      return {
        defaultValue: { ...model },
        internalValue: {
          ...model,
          ...this.value
        }
      };
    },

    computed: {
      assetsListKeys() {
        return this.$store.getters['assets/listKeys'](this.assetsFilter);
      },

      selectedAsset() { return this.$store.getters['assets/one'](this.internalValue.symbol); }
    },
    watch: {
      'selectedAsset.precision': {
        immediate: true,
        handler(val) {
          this.internalValue.precision = val;
        }
      },
      'selectedAsset._id': {
        immediate: true,
        handler(val) {
          this.internalValue.id = val;
        }
      },
      value: {
        handler(newVal, oldVal) {
          if (!isEqual(newVal, oldVal)) {
            this.internalValue = newVal || { ...this.defaultValue };
          }
        },
        deep: true
      },
      internalValue: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (!isEqual(newVal, oldVal)) {
            this.$emit('change', newVal);
          }
        }
      }
    }
  };
</script>
