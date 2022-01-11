<template>
  <validation-observer
    v-slot="{ invalid, handleSubmit }"
    ref="observer"
    class="create-security-token-form"
  >
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(createAsset)"
    >
      <ve-stack :gap="32">
        <vex-block
          :title="$t('module.assets.createTokenForm.title', {entity: sentenceCase(projectAlias) })"
          title-margin="16"
        >
          <v-row>
            <v-col cols="8">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('module.assets.createTokenForm.numberOfTokens')"
                rules="required|integer"
              >
                <v-text-field
                  v-model.number="formModel.maxSupply"
                  :label="$t('module.assets.createTokenForm.totalNumberOfTokens')"
                  outlined
                  hide-details="auto"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>

            <v-col cols="4">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('module.assets.createTokenForm.ticker')"
                :rules="{
                  required: true,
                  minMax: { min: 5, max: 6 },
                  unique: { list: assetsKeys }
                }"
                :custom-messages="{
                  unique: $t('module.assets.createTokenForm.errors.tickerUnique')
                }"
              >
                <v-text-field
                  v-model="formModel.symbol"
                  v-maska="assetMask"
                  :label="$t('module.assets.createTokenForm.ticker')"
                  outlined
                  hide-details="auto"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>
          </v-row>

          <div class="text-body-2">
            {{ $t('module.assets.createTokenForm.tokensAmountNote', {entity: projectAlias}) }}
          </div>
        </vex-block>

        <vex-block :title="$t('module.assets.createTokenForm.shareholders')" title-margin="16">
          <div class="text-body-2">
            {{ $t('module.assets.createTokenForm.shareholdersNote') }}
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
                    outlined
                    :label="$t('module.assets.createTokenForm.shareholder')"
                    :hide-details="true"
                  >
                    <template #selection="{ item }">
                      <div
                        class="d-inline-flex mr-4 align-center"
                        style="max-width: calc(100% - 80px)"
                      >
                        <team-avatar :team="item" :size="24" class="mr-2" />
                        <div class="text-truncate">
                          {{ $$teamTitle(item) }}
                        </div>
                      </div>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    :label="$t('module.assets.createTokenForm.tokens')"
                    :value="teamTokens.amount"
                    outlined
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
                    :name="$t('module.assets.createTokenForm.shareholder')"
                    rules="required"
                  >
                    <users-selector
                      v-model="item.account"
                      :label="$t('module.assets.createTokenForm.shareholder')"
                      outlined
                      hide-details="auto"
                      :error-messages="errors"
                      :filter-items="shareholdersFilter(item.account)"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="3">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="$t('module.assets.createTokenForm.tokens')"
                    rules="integer|required"
                  >
                    <v-text-field
                      v-model="item.amount"
                      :label="$t('module.assets.createTokenForm.tokens')"
                      outlined
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
              :label="$t('module.assets.createTokenForm.addShareholder')"
              :disabled="loading"
              @click="handleAddShareholderClick"
            />
          </vex-timeline>
        </vex-block>

        <vex-block :title="$t('module.assets.createTokenForm.legal')">
          <div>
            <v-row>
              <v-col>
                <validation-provider
                  :name="$t('module.assets.createTokenForm.confirmation')"
                  :rules="{ required: { allowFalse: false } }"
                >
                  <v-checkbox
                    v-model="formModel.terms"
                    :hide-details="true"
                    class="ma-0 pa-0"
                  >
                    <template #label>
                      <i18n path="module.assets.createTokenForm.agree" class="text-body-2">
                        <a :href="tosUrl" target="_blank" @click.stop>
                          {{ $t('module.assets.createTokenForm.tos') }}
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
                  :name="$t('module.assets.createTokenForm.confirmation')"
                  :rules="{required: {allowFalse: false}}"
                >
                  <v-checkbox
                    v-model="formModel.confirm"
                    :hide-details="true"
                    class="ma-0 pa-0"
                  >
                    <template #label>
                      <div class="text-body-2">
                        {{ $t('module.assets.createTokenForm.understand', {entity: projectAlias}) }}
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
              outlined
              :disabled="loading"
              @click="handleCancelClick"
            >
              {{ $t('module.assets.createTokenForm.cancel') }}
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              :disabled="invalid"
              :loading="loading"
            >
              {{ $t('module.assets.createTokenForm.submit') }}
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

  export default defineComponent({
    name: 'CreateProjectSecurityTokenForm',

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
      project: {
        type: Object,
        required: true
      },
      team: {
        type: Object,
        required: true
      },
      projectAlias: {
        type: String,
        required: true
      },
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
      assetsKeys() { return this.$store.getters['assets/listKeys'](); },

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

      addShareholder() {
        this.formModel.holders = [
          ...this.formModel.holders,
          ...[shareholderModel()]
        ];
      },

      removeShareholder(item) {
        const idx = this.formModel.holders.indexOf(item);
        if (idx !== -1) {
          this.formModel.holders.splice(idx, 1);
          this.formModel.holders = [...new Set(this.formModel.holders)];
        }
      },

      shareholdersFilter(keepUser) {
        return {
          '!_id': this.formModel.holders.map((h) => h.account).filter((u) => u !== keepUser)
        };
      },

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
        this.$emit('success');
      },

      emitError(error) {
        this.$emit('error', error);
      },

      handleAddShareholderClick() {
        this.addShareholder();
      },

      handleRemoveShareholderClick(item) {
        this.removeShareholder(item);
      },

      handleCancelClick() {
        this.$emit('cancel');
      },

      async createAsset() {
        this.loading = true;
        const DEFAULT_PRECISION = 0;

        const payload = {
          user: this.$currentUser,
          data: {
            symbol: this.formModel.symbol,
            issuer: this.team._id,
            precision: DEFAULT_PRECISION,
            maxSupply: parseInt(this.formModel.maxSupply),
            description: '',
            projectTokenOption: {
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
