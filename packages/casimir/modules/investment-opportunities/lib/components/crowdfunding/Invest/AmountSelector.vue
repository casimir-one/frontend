<template>
  <ve-stack>
    <v-item-group v-model="internalValue">
      <ve-auto-grid :cols="2">
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
      </ve-auto-grid>
    </v-item-group>

    <validation-observer ref="amountObserver">
      <validation-provider
        v-slot="{ errors }"
        :name="$t('module.crowdfunding.amountSelector.amount')"
        :rules="{
          number: true,
          minMaxValue: {
            min: 1,
            max: remainingAmount
          }
        }"
      >
        <v-text-field
          :value="textFieldValue"
          autocomplete="off"
          :placeholder="$t('module.crowdfunding.amountSelector.enterAmount')"
          :suffix="asset"
          :error-messages="errors"
          @focus="handleTextFieldFocus"
          @input="handleTextFieldInput"
          @blur="handleTextFieldBlur"
        />
      </validation-provider>
    </validation-observer>
  </ve-stack>
</template>

<script>
  import { VeAutoGrid, VeStack } from '@deip/vue-elements';

  const NUMBER_OF_STEPS = 6;

  /**
   * Component for creating amount selector
   * @displayName AmountSelector
   * @requires VeAutoGrid
   * @requires VeStack
   */
  export default {
    name: 'AmountSelector',
    components: {
      VeAutoGrid,
      VeStack
    },

    model: {
      prop: 'value',
      event: 'change'
    },

    props: {
      /**
       * Goal amount
       */
      goalAmount: {
        type: Number,
        default: 1000
      },
      /**
       * Remaining amount
       */
      remainingAmount: {
        type: Number,
        default: 0
      },
      /**
       * Asset
       */
      asset: {
        type: String,
        default: null
      },
      /**
       * @model
       */
      value: {
        type: Number,
        default: null
      },
      /**
       * Item should be disabled
       */
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
      /**
       * Get computed amounts
       */
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

        result.push(this.goalAmount);
        for (let i = NUMBER_OF_STEPS - 1; i > 0; i -= 1) {
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
        /**
           * Triggers when value changes
           *
           * @property {number} val
           */
        this.$emit('change', val);
      }
    },

    methods: {
      /**
       * Triggers by clicking on item
       *
       * @event click
       * @param {number} amount
       */
      handleSelect(amount) {
        this.textFieldValue = null;
        this.internalValue = amount;
      },
      /**
       * Triggers by focus on text field
       *
       * @event focus
       */
      handleTextFieldFocus() {
        this.internalValue = null;
      },
      /**
       * Text field input trigger
       *
       * @event input
       * @param {string} val
       */
      handleTextFieldInput(val) {
        this.textFieldValue = val;
      },
      /**
       * Text field blur trigger
       *
       * @event blur
       */
      handleTextFieldBlur() {
        this.$refs.amountObserver.validate()
          .then((isValid) => {
            if (isValid) {
              this.internalValue = parseFloat(this.textFieldValue);
            }
          });
      },
      /**
       * Get amount class
       *
       * @param {number} amount
       * @param {boolean} active
       * @param {boolean} disabled
       */
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
