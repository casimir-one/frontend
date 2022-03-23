<template>
  <validation-observer
    v-slot="{ invalid, handleSubmit }"
    ref="observer"
    class="create-nft-form"
  >
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(createAsset)"
    >
      <ve-stack :gap="32">
        <vex-block
          :title="$t('module.assets.createNFTForm.title', {entity: sentenceCase(projectAlias) })"
          title-margin="16"
        >
          <v-row>
            <v-col cols="8">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('module.assets.createNFTForm.numberOfTokens')"
                rules="required|integer"
              >
                <v-text-field
                  v-model.number="formModel.maxSupply"
                  :label="$t('module.assets.createNFTForm.totalNumberOfTokens')"
                  hide-details="auto"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>

            <v-col cols="4">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('module.assets.createNFTForm.ticker')"
                :rules="{
                  required: true,
                  minMax: { min: 5, max: 6 },
                  unique: { list: assetsKeys }
                }"
                :custom-messages="{
                  unique: $t('module.assets.createNFTForm.errors.tickerUnique')
                }"
              >
                <v-text-field
                  v-model="formModel.symbol"
                  v-maska="assetMask"
                  :label="$t('module.assets.createNFTForm.ticker')"
                  hide-details="auto"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>
          </v-row>

          <div class="text-body-2">
            {{ $t('module.assets.createNFTForm.tokensAmountNote', {entity: projectAlias}) }}
          </div>
        </vex-block>

        <vex-block :title="$t('module.assets.createNFTForm.shareholders')" title-margin="16">
          <div class="text-body-2">
            {{ $t('module.assets.createNFTForm.shareholdersNote') }}
          </div>

          <vex-timeline>
            <vex-timeline-item :dot-top="16">
              <v-row class="align-center">
                <v-col cols="6">
                  <v-select
                    :items="[team]"
                    item-text="name"
                    item-value="_id"
                    :value="team._id"
                    disabled
                    :label="$t('module.assets.createNFTForm.shareholder')"
                    :hide-details="true"
                  >
                    <template #selection="{ item }">
                      <div
                        class="d-inline-flex mr-4 align-center"
                        style="max-width: calc(100% - 80px)"
                      >
                        <team-avatar :team="item" :size="24" class="mr-2" />
                        <div class="text-truncate">
                          {{ $$teamName(item) }}
                        </div>
                      </div>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    :label="$t('module.assets.createNFTForm.tokens')"
                    :value="teamTokens.amount"
                    :hide-details="true"
                    disabled
                  />
                </v-col>
                <v-col class="text-body-2">
                  {{ convertAmountToPercent(teamTokens.amount) }}
                </v-col>
                <v-col cols="auto">
                  <v-btn icon disabled>
                    <v-icon>mdi-lock</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </vex-timeline-item>

            <vex-timeline-item
              v-for="(item, index) of formModel.holders"
              :key="`row-${index}`"
              :dot-top="16"
              :ctrl-height="48"
            >
              <v-row>
                <v-col cols="6">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="$t('module.assets.createNFTForm.shareholder')"
                    rules="required"
                  >
                    <users-selector
                      v-model="item.account"
                      :label="$t('module.assets.createNFTForm.shareholder')"
                      hide-details="auto"
                      :error-messages="errors"
                      :filter-items="shareholdersFilter(item.account)"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="3">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="$t('module.assets.createNFTForm.tokens')"
                    rules="integer|required"
                  >
                    <v-text-field
                      v-model="item.amount"
                      :label="$t('module.assets.createNFTForm.tokens')"
                      hide-details="auto"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
                <v-col class="text-body-2 d-flex align-center" style="height: 72px;">
                  {{ convertAmountToPercent(item.amount) }}
                </v-col>
                <v-col cols="auto" class="d-flex align-center" style="height: 72px;">
                  <v-btn
                    icon
                    :disabled="loading"
                    @click="handleRemoveShareholderClick(item)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </vex-timeline-item>

            <vex-timeline-add
              :label="$t('module.assets.createNFTForm.addShareholder')"
              :disabled="loading"
              @click="handleAddShareholderClick"
            />
          </vex-timeline>
        </vex-block>

        <vex-block :title="$t('module.assets.createNFTForm.legal')">
          <div>
            <v-row>
              <v-col>
                <validation-provider
                  :name="$t('module.assets.createNFTForm.confirmation')"
                  :rules="{ required: { allowFalse: false } }"
                >
                  <v-checkbox
                    v-model="formModel.terms"
                    :hide-details="true"
                    class="ma-0 pa-0"
                  >
                    <template #label>
                      <i18n path="module.assets.createNFTForm.agree" class="text-body-2">
                        <a :href="tosUrl" target="_blank" @click.stop>
                          {{ $t('module.assets.createNFTForm.tos') }}
                        </a>
                      </i18n>
                    </template>
                  </v-checkbox>
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <validation-provider
                  :name="$t('module.assets.createNFTForm.confirmation')"
                  :rules="{required: {allowFalse: false}}"
                >
                  <v-checkbox
                    v-model="formModel.confirm"
                    :hide-details="true"
                    class="ma-0 pa-0"
                  >
                    <template #label>
                      <div class="text-body-2">
                        {{ $t('module.assets.createNFTForm.understand', {entity: projectAlias}) }}
                      </div>
                    </template>
                  </v-checkbox>
                </validation-provider>
              </v-col>
            </v-row>
          </div>
        </vex-block>

        <v-divider />

        <div class="d-flex">
          <v-spacer />

          <ve-stack flow="column" :gap="16">
            <v-btn
              color="primary"
              :disabled="loading"
              @click="handleCancelClick"
            >
              {{ $t('module.assets.createNFTForm.cancel') }}
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              :disabled="invalid"
              :loading="loading"
            >
              {{ $t('module.assets.createNFTForm.submit') }}
            </v-btn>
          </ve-stack>
        </div>
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import currency from 'currency.js';
  import { sentenceCase } from 'change-case';

  import { defineComponent } from '@deip/platform-util';
  import {
    VexBlock,
    VexTimeline,
    VexTimelineItem,
    VexTimelineAdd
  } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import { UsersSelector } from '@deip/users-module';
  import { TeamAvatar, teamHelpersMixin } from '@deip/teams-module';

  const shareholderModel = () => ({
    account: undefined,
    amount: 0
  });

  /**
   * Component for creating non fungible token form
   * @displayName  CreateNonFungibleTokenForm
   * @requires VexBlock
   * @requires VexTimeline
   * @requires VexTimelineItem
   * @requires VexTimelineAdd
   * @requires VeStack
   * @requires UsersSelector
   * @requires TeamAvatar
   */
  export default defineComponent({
    name: 'CreateNonFungibleTokenForm',

    components: {
      UsersSelector,
      TeamAvatar,
      VexBlock,
      VeStack,
      VexTimeline,
      VexTimelineItem,
      VexTimelineAdd
    },

    mixins: [teamHelpersMixin],

    props: {
      /**
       * Project info
       */
      project: {
        type: Object,
        required: true
      },
      /**
       * Team info
       */
      team: {
        type: Object,
        required: true
      },
      /**
       * Project alias
       */
      projectAlias: {
        type: String,
        required: true
      },
      /**
       * Redirect url
       */
      tosUrl: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        assetMask: {
          mask: 'ZZZZZZ',
          tokens: {
            Z: {
              pattern: /[a-zA-Z]/,
              transform: (v) => v.toLocaleUpperCase()
            }
          }
        },
        formModel: {
          maxSupply: 10000,
          symbol: undefined,
          holders: [],
          terms: false,
          confirm: false
        },
        loading: false
      };
    },

    computed: {
      /**
       *  Get assets keys
       */
      assetsKeys() { return this.$store.getters['assets/listKeys'](); },
      /**
       *  Get team tokens
       */
      teamTokens() {
        const tokensSpend = this.formModel.holders
          .map((s) => parseFloat(s.amount))
          .filter((a) => a)
          .reduce((a, b) => a + b, 0);

        return {
          account: this.team._id,
          amount: this.formModel.maxSupply - tokensSpend
        };
      }
    },

    methods: {
      sentenceCase,
      /**
       *  Add shareholder to holders array
       */
      addShareholder() {
        this.formModel.holders = [
          ...this.formModel.holders,
          ...[shareholderModel()]
        ];
      },
      /**
       *  Remove shareholder
       *
       * @param {Object} item
       */
      removeShareholder(item) {
        const idx = this.formModel.holders.indexOf(item);
        if (idx !== -1) {
          this.formModel.holders.splice(idx, 1);
          this.formModel.holders = [...new Set(this.formModel.holders)];
        }
      },
      /**
       *  Get shareholders filter
       *
       * @param {string} keepUser
       */
      shareholdersFilter(keepUser) {
        return {
          '!_id': this.formModel.holders.map((h) => h.account).filter((u) => u !== keepUser)
        };
      },
      /**
       * Convert amount to percent
       *
       * @param {number} amount
       */
      convertAmountToPercent(amount) {
        return currency(
          (amount / this.formModel.maxSupply) * 100,
          {
            symbol: '%',
            pattern: '#!',
            negativePattern: '-#!'
          }
        ).format();
      },

      emitSuccess() {
        /**
       * Success event.
       */
        this.$emit('success');
      },

      emitError(error) {
        /**
       * Triggers when error occurs
       *
       * @property {Error} error
       */
        this.$emit('error', error);
      },
      /**
       * Triggers by clicking on add shareholder button
       *
       * @event click
       */
      handleAddShareholderClick() {
        this.addShareholder();
      },
      /**
       * Triggers by clicking on remove shareholder button
       *
       * @param {Object} item
       * @event click
       */
      handleRemoveShareholderClick(item) {
        this.removeShareholder(item);
      },

      handleCancelClick() {
        /**
         * Triggers by clicking on cancel button
         */
        this.$emit('cancel');
      },
      /**
       * Create asset
       */
      async createAsset() {
        this.loading = true;
        const DEFAULT_PRECISION = 0;

        const payload = {
          initiator: this.$currentUser,
          data: {
            symbol: this.formModel.symbol,
            issuer: this.team._id,
            precision: DEFAULT_PRECISION,
            maxSupply: parseInt(this.formModel.maxSupply),
            description: '',
            projectTokenSettings: {
              projectId: this.project._id,
              teamId: this.team._id,
              licenseRevenue: {
                holdersShare: '100.00 %'
              }
            },
            holders: [
              this.teamTokens,
              ...this.formModel.holders
            ].map((holder) => ({
              account: holder.account,
              asset: {
                amount: holder.amount,
                symbol: this.formModel.symbol,
                precision: DEFAULT_PRECISION
              }
            }))
          }
        };

        try {
          await this.$store.dispatch('assets/create', payload);
          this.emitSuccess();
        } catch (error) {
          this.emitError(error);
        }

        this.loading = false;
      }
    }
  });
</script>
