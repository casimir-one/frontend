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
          :value="internalValue.amount"
          class="rounded-br-0 rounded-tr-0"
          :label="label"
          hide-details="auto"
          :error-messages="[...errors, ...errorMessages]"
          :name="$t('module.assets.input.amount')"
          autocomplete="off"
          @input="handleAmountInput"
        />
      </validation-provider>
    </v-col>
    <v-col cols="4">
      <v-select
        :value="internalValue.symbol"
        class="rounded-bl-0 rounded-tl-0"
        :items="assetsListKeys"
        :hide-details="true"
        :disabled="disableAssets"
        @change="handleSymbolChange"
      />
    </v-col>
  </v-row>
</template>

<script>
  import { isEqual } from '@deip/toolbox/lodash';

  const defaultValue = {
    id: null,
    symbol: null,
    precision: null,
    amount: null
  };

  export default {
    name: 'AssetInput',

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
      const lazyValue = {
        ...defaultValue,
        ...this.value
      };

      return {
        lazyValue
      };
    },

    computed: {
      assetsListKeys() {
        return this.$store.getters['assets/listKeys'](this.assetsFilter);
      },

      selectedAsset() {
        if (this.internalValue.symbol) return this.$store.getters['assets/one'](this.internalValue.symbol);
        if (this.assetsListKeys.length) return this.$store.getters['assets/one'](this.assetsListKeys[0]);
        return null;
      },

      internalValue: {
        get() {
          return this.lazyValue;
        },
        set(val) {
          if (isEqual(val, this.lazyValue)) return;
          this.emitValueChange(val);
        }
      }
    },

    watch: {
      selectedAsset: {
        handler(newVal) {
          if (newVal?._id === this.internalValue.id) return;

          if (!newVal) {
            this.internalValue = {
              ...defaultValue,
              amount: this.internalValue.amount
            };
            return;
          }

          this.internalValue = {
            ...this.internalValue,
            id: newVal._id,
            precision: newVal.precision,
            symbol: newVal.symbol
          };
        },
        immediate: true,
        deep: true
      },

      value: {
        handler(newVal) {
          if (isEqual(newVal, this.lazyValue)) return;

          this.lazyValue = newVal || { ...defaultValue };
        },
        deep: true
      }
    },

    methods: {
      emitValueChange(val) {
        this.$emit('change', val);
      },

      handleAmountInput(value) {
        this.internalValue = {
          ...this.internalValue,
          amount: value
        };
      },

      handleSymbolChange(value) {
        this.internalValue = {
          ...this.internalValue,
          symbol: value
        };
      }
    }
  };
</script>
