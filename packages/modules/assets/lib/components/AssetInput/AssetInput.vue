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
        :rules="required ? 'required|number' : ''"
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
          @change="update()"
        />
      </validation-provider>
    </v-col>
    <v-col cols="4">
      <v-select
        v-model="internalValue.assetId"
        class="rounded-bl-0 rounded-tl-0"
        :items="assetsListKeys"
        :hide-details="true"
        :disabled="disableAssets"
        outlined
        @change="update()"
      />
    </v-col>
  </v-row>
</template>

<script>
  // eslint-disable-next-line import/extensions, import/no-unresolved
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { objectedModel } from '@deip/platform-fns';

  import { assetsMixin } from '../../mixins';

  export default {
    name: 'AssetInput',
    mixins: [Proxyable, objectedModel, assetsMixin],
    props: {
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
      errorMessages: {
        type: Array,
        default: () => ([])
      }
    },
    data() {
      const model = {
        amount: undefined,
        assetId: this.$env.ASSET_UNIT
      };

      return {
        ...model,

        internalLazyValue: this.value
          ? {
            ...model,
            ...this.value
          } : model
      };
    },
    computed: {
      assetsListKeys() { return this.$store.getters['assets/listKeys'](); }
    },
    methods: {
      update() {
        const val = {
          ...(this.amount ? { amount: parseFloat(this.internalLazyValue.amount) } : {}),
          assetId: this.internalLazyValue.assetId
        };

        this.internalValue = {
          ...this.internalValue,
          ...val
        };
      }
    }
  };
</script>
