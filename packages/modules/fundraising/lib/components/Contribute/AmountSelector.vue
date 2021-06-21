<template>
  <vex-stack>
    <v-item-group v-model="internalValue">
      <vex-grid>
        <v-item
          v-for="amount in amounts"
          v-slot="{ active }"
          :key="amount"
          :value="amount"
          :disabled="disabled"
        >
          <div
            :class="getAmountClass(amount, active, disabled)"
            @click="handleSelect(amount)"
          >
            {{ amount }} {{ asset }}
          </div>
        </v-item>
      </vex-grid>
    </v-item-group>

    <v-text-field
      :value="textFieldValue"
      autocomplete="off"
      :placeholder="$t('module.fundraising.amountSelector.enterAmount')"
      hide-details
      :suffix="asset"
      @focus="handleTextFieldFocus"
      @input="handleTextFieldInput"
      @blur="handleTextFieldBlur"
    />
  </vex-stack>
</template>

<script>
  import { VexGrid, VexStack } from '@deip/vuetify-extended';

  const NUMBER_OF_STEPS = 6;

  export default {
    name: 'AmountSelector',
    components: {
      VexGrid,
      VexStack
    },

    model: {
      prop: 'value',
      event: 'change'
    },

    props: {
      goalAmount: {
        type: Number,
        default: 1000
      },
      remainingAmount: {
        type: Number,
        default: 0
      },
      asset: {
        type: String,
        default: null
      },
      value: {
        type: Number,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        internalValue: this.value,
        textFieldValue: this.value
      };
    },

    computed: {
      amounts() {
        const step = Math.floor(this.goalAmount / NUMBER_OF_STEPS);
        const result = [];
        let rounding = 100;

        if (this.goalAmount <= NUMBER_OF_STEPS * 100) {
          rounding = 10;
        }
        if (this.goalAmount <= NUMBER_OF_STEPS * 10) {
          rounding = 1;
        }

        for (let i = NUMBER_OF_STEPS; i > 0; i -= 1) {
          const value = rounding * Math.floor((step * i) / rounding);
          if (value > 0) {
            result.push(value);
          }
        }
        return result;
      }
    },

    watch: {
      internalValue(val) {
        this.$emit('change', val);
      }
    },

    methods: {
      handleSelect(amount) {
        this.textFieldValue = null;
        this.internalValue = amount;
      },

      handleTextFieldFocus() {
        this.internalValue = null;
      },

      handleTextFieldInput(val) {
        this.textFieldValue = val;
      },

      handleTextFieldBlur() {
        this.internalValue = parseFloat(this.textFieldValue);
      },

      getAmountClass(amount, active, disabled) {
        return [
          'amount outlined rounded p-2 d-flex justify-center align-center',
          {
            'amount--disabled text--disabled': disabled || amount > this.remainingAmount,
            'amount--active': active
          }];
      }
    }
  };
</script>

<style scoped lang="scss">
  .amount {
    height: 48px;
    cursor: pointer;

    &:hover, &--active {
      color: var(--v-primary-base) !important;
      border-color: var(--v-primary-base);
      background-color: var(--v-primary-lighten5);
    }

    &--disabled {
      pointer-events: none;
    }
  }
</style>
