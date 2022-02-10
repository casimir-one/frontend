<template>
  <vex-block
    :title="$t('module.crowdfunding.createForm.determineNumberOfTokens')"
    compact
  >
    <v-row>
      <v-col cols="6">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.crowdfunding.createForm.units')"
          :rules="{
            required: true,
            minMaxValue: {
              min: MIN_TOKEN_UNITS_TO_SELL,
              max: availableTokens.amount
            }
          }"
        >
          <v-text-field
            v-model="internalTokens"
            persistent-hint
            :error-messages="errors"
            :suffix="availableTokens.symbol"
            :hint="tokensHint"
            autocomplete="off"
          >
            <template #message="{ message }">
              <div class="text-caption" v-html="message" />
            </template>
          </v-text-field>
        </validation-provider>
      </v-col>
    </v-row>
  </vex-block>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VexBlock } from '@deip/vuetify-extended';
  import { assetsMixin } from '@deip/assets-module';
  import { MIN_TOKEN_UNITS_TO_SELL } from '@deip/constants';

  export default defineComponent({
    name: 'CrowdfundingTokensInput',

    components: {
      VexBlock
    },

    mixins: [assetsMixin],

    model: {
      prop: 'tokens',
      event: 'input'
    },

    props: {
      tokens: {
        type: String,
        default: null
      },
      issuedTokens: {
        type: Object,
        default: null
      },
      availableTokens: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        MIN_TOKEN_UNITS_TO_SELL
      };
    },

    computed: {
      internalTokens: {
        get() {
          return this.tokens;
        },
        set(value) {
          this.$emit('input', value);
        }
      },

      tokensHint() {
        if (!this.internalTokens) return '';

        const messages = [
          `${this.toPercent(this.internalTokens, this.issuedTokens)} of ${this.$$formatAsset(this.issuedTokens)} issued tokens`
        ];

        if (this.issuedTokens
          && this.availableTokens
          && parseFloat(this.issuedTokens.amount) > parseFloat(this.availableTokens.amount)) {
          messages.push(
            `${this.toPercent(this.internalTokens, this.availableTokens)} of ${this.$$formatAsset(this.availableTokens)} team's tokens`
          );
        }

        return messages.join('<br>');
      }
    },

    methods: {
      toPercent(val, from) {
        if (!val) return '';
        const pc = (val / from.amount) * 100;

        return `${Math.round(pc * 100) / 100}%`;
      }
    }
  });
</script>
