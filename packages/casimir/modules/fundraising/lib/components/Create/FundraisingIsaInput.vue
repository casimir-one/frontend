<template>
  <vex-block
    :title="$t('module.fundraising.createForm.selectISA')"
    compact
  >
    <v-row>
      <v-col cols="12" md="6">
        <validation-provider
          v-slot="{ errors }"
          name=" "
          rules="required|number|minValue:1"
        >
          <v-text-field
            v-model="quantity"
            :error-messages="errors"
            :label="$t('module.fundraising.createForm.isaQuantity')"
            autocomplete="off"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6">
        <validation-provider
          v-slot="{ errors }"
        >
          <asset-input
            v-model="assetPerItem"
            :label="$t('module.fundraising.createForm.isaAmountPerItem')"
            required
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
  import { VexBlock } from '@deip/vuetify-extended';
  import { AssetInput } from '@deip/assets-module';

  export default defineComponent({
    name: 'FundraisingIsaInput',

    components: { VexBlock, AssetInput },

    model: {
      prop: 'isa',
      event: 'change'
    },

    props: {
      isa: {
        type: Object,
        default: () => ({
          assetPerItem: null,
          quantity: null
        })
      },
      capAssetsFilter: {
        type: Object,
        default() { return {}; }
      }
    },

    computed: {
      assetPerItem: {
        get() {
          return this.isa.assetPerItem;
        },

        set(value) {
          this.$emit('change', { assetPerItem: value, quantity: this.quantity });
        }
      },

      quantity: {
        get() {
          return this.isa.quantity;
        },

        set(value) {
          this.$emit('change', { quantity: value, assetPerItem: this.assetPerItem });
        }
      }
    }
  });
</script>
