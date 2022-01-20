<template>
  <vex-block
    :title="noHardCap
      ? $t('module.fundraising.createForm.selectAmount')
      : $t('module.fundraising.createForm.selectAmounts')"
    compact
  >
    <v-row>
      <v-col cols="6">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.fundraising.createForm.min')"
          vid="softCap"
          rules="assetSmaller:@hardCap"
        >
          <asset-input
            v-model="softCap"
            :label="$t('module.fundraising.createForm.min')"
            required
            :assets-filter="capAssetsFilter"
            :error-messages="errors"
          />
        </validation-provider>
      </v-col>

      <v-col v-if="!noHardCap" cols="6">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.fundraising.createForm.max')"
          vid="hardCap"
          rules="assetGreater:@softCap"
        >
          <asset-input
            v-model="hardCap"
            :label="$t('module.fundraising.createForm.max')"
            required
            disable-assets
            :assets-filter="capAssetsFilter"
            :error-messages="errors"
          />
        </validation-provider>
      </v-col>
    </v-row>
  </vex-block>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { extend } from '@deip/validation-plugin';
  import { proxydi } from '@deip/proxydi';
  import { VexBlock } from '@deip/vuetify-extended';
  import { AssetInput } from '@deip/assets-module';

  extend('assetSmaller', {
    params: ['target'],
    validate(value, { target }) {
      if (!(target && target.amount) || !(value && value.amount)) return true;
      return parseFloat(value.amount) < parseFloat(target.amount);
    },
    message: (_, values) => {
      const i18n = proxydi.get('i18n');
      return i18n.t('module.fundraising.createForm.validations.assetSmaller', values);
    }
  });

  extend('assetGreater', {
    params: ['target'],
    validate(value, { target }) {
      if (!(target && target.amount) || !(value && value.amount)) return true;

      return parseFloat(value.amount) > parseFloat(target.amount);
    },
    message: (_, values) => {
      const i18n = proxydi.get('i18n');
      return i18n.t('module.fundraising.createForm.validations.assetGreater', values);
    }
  });

  export default defineComponent({
    name: 'FundraisingAmountInput',

    components: { VexBlock, AssetInput },

    model: {
      prop: 'caps',
      event: 'change'
    },

    props: {
      caps: {
        type: Object,
        default: () => ({
          soft: undefined,
          hard: undefined
        })
      },
      noHardCap: {
        type: Boolean,
        default: false
      },
      capAssetsFilter: {
        type: Object,
        default() { return {}; }
      }
    },

    computed: {
      softCap: {
        get() {
          return this.caps.soft;
        },
        set(value) {
          const hardCapAmount = this.noHardCap ? value.amount : this.hardCap.amount;

          this.emitValueChange({
            soft: value,
            hard: { ...value, amount: hardCapAmount }
          });
        }
      },
      hardCap: {
        get() {
          return this.caps.hard;
        },
        set(value) {
          this.emitValueChange({
            soft: { ...value, amount: this.softCap.amount },
            hard: value
          });
        }
      }
    },

    methods: {
      emitValueChange(value) {
        this.$emit('change', value);
      }
    }
  });
</script>
