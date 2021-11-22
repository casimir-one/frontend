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
          v-model="amount"
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
        v-model="symbol"
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
      const model = {
        id: this.$env.CORE_ASSET.id,
        symbol: this.$env.CORE_ASSET.symbol,
        precision: this.$env.CORE_ASSET.precision,
        amount: undefined
      };

      const lazyValue = {
        ...model,
        ...this.value
      };

      return {
        defaultValue: { ...model },
        lazyValue,

        amount: lazyValue.amount,
        symbol: lazyValue.symbol
      };
    },

    computed: {
      assetsListKeys() {
        return this.$store.getters['assets/listKeys'](this.assetsFilter);
      },

      selectedAsset() { return this.$store.getters['assets/one'](this.internalValue.symbol); },

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
        handler(newVal, oldVal) {
          if (newVal?._id === oldVal?._id) return;

          this.internalValue = {
            ...this.internalValue,
            id: newVal._id,
            precision: newVal.precision
          };
        },
        immediate: true,
        deep: true
      },

      value: {
        handler(newVal) {
          if (isEqual(newVal, this.lazyValue)) return;

          this.lazyValue = newVal || { ...this.defaultValue };
        },
        deep: true
      },

      amount(newVal) {
        this.internalValue = {
          ...this.internalValue,
          amount: newVal
        };
      },

      symbol(newVal) {
        this.internalValue = {
          ...this.internalValue,
          symbol: newVal
        };
      }
    },

    methods: {
      emitValueChange(val) {
        this.$emit('change', val);
      }
    }
  };
</script>
