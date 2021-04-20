<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(createAsset)"
    >
      <vex-stack gap="32">
        <vex-block :title="`${sentenceCase(projectAlias)} token details`" title-margin="16">
          <div class="text-body-2">
            {{ sentenceCase(projectAlias) }}: {{ project.title }}
          </div>

          <v-row>
            <v-col cols="8">
              <validation-provider
                v-slot="{ errors }"
                name="Number of tokens"
                rules="required|integer"
              >
                <v-text-field
                  v-model.number="formModel.maxSupply"
                  label="Total number of tokens to issue"
                  outlined
                  hide-details="auto"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider
                v-slot="{ errors }"
                name="Ticker (abbreviation)"
                :rules="{
                  required: true,
                  minMax: { min: 5, max: 6 },
                  unique: { list: assetsKeys }
                }"
                :custom-messages="{
                  unique: '{_field_} is taken. Try another.'
                }"
              >
                <v-text-field
                  v-model="formModel.symbol"
                  v-maska="assetMask"
                  label="Ticker (abbreviation)"
                  outlined
                  hide-details="auto"
                  :error-messages="errors"
                />
              </validation-provider>
            </v-col>
          </v-row>

          <div class="text-body-2">
            Note: 2,000 to 20,000 tokens are usualy issued per {{ projectAlias }}.
          </div>
        </vex-block>

        <vex-block title="Shareholders" title-margin="16">
          <div class="text-body-2">
            Note: Only tokens that belong to a team can be used for fundraising.
          </div>
          <vex-timeline>
            <vex-timeline-item :dot-top="16">
              <v-row class="align-center">
                <v-col cols="6">
                  <v-select
                    :items="[teamData]"
                    item-text="name"
                    item-value="external_id"
                    :value="teamData.external_id"
                    disabled
                    outlined
                    label="Shareholder"
                    :hide-details="true"
                  >
                    <template #selection="{ item }">
                      <div
                        class="d-inline-flex mr-4 align-center"
                        style="max-width: calc(100% - 80px)"
                      >
                        <v-avatar :size="24" class="mr-2">
                          <img :src="accountAvatarSrc(item)" alt="">
                        </v-avatar>
                        <div class="text-truncate">
                          {{ item.name }}
                        </div>
                      </div>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    label="Tokens"
                    :value="teamTokens.amount"
                    outlined
                    :hide-details="true"
                    disabled
                  />
                </v-col>
                <v-col class="text-body-2">
                  {{ toPercent(teamTokens.amount) }}
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
                    name="Shareholder"
                    rules="required"
                  >
                    <users-selector
                      v-model="item.account"
                      label="Shareholder"
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
                    name="Tokens"
                    rules="integer|required"
                  >
                    <v-text-field
                      v-model="item.amount"
                      label="Tokens"
                      outlined
                      hide-details="auto"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
                <v-col class="text-body-2 d-flex align-center" style="height: 72px;">
                  {{ toPercent(item.amount) }}
                </v-col>
                <v-col cols="auto" class="mt-2 d-flex align-center" style="height: 72px;">
                  <v-btn icon @click="removeShareholder(item)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </vex-timeline-item>

            <vex-timeline-add
              label="Add shareholder"
              @click="addShareholder()"
            />
          </vex-timeline>
        </vex-block>

        <vex-block title="Legal">
          <v-row no-gutters>
            <v-col cols="auto">
              <validation-provider
                ref="s"
                name="Confirmation"
                :rules="{ required: { allowFalse: false } }"
              >
                <v-checkbox
                  v-model="formModel.terms"
                  :hide-details="true"
                  class="ma-0 pa-0"
                />
              </validation-provider>
            </v-col>
            <v-col style="padding-top:2px">
              <div class="text-body-2">
                I agree to the Terms and Conditions listed below
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="auto">
              <validation-provider
                ref="s"
                name="Confirmation"
                :rules="{required: {allowFalse: false}}"
              >
                <v-checkbox
                  v-model="formModel.confirm"
                  :hide-details="true"
                  class="ma-0 pa-0"
                />
              </validation-provider>
            </v-col>
            <v-col style="padding-top:2px">
              <div class="text-body-2">
                I understand that issued tokens will be distributed among shareholders,
                effectively transferring ownership
                over the property related to the {{ projectAlias }}.
                Holding a share does not grant access to participate on
                decisions related to the {{ projectAlias }}.
                It’s not possible to undo this action.
              </div>
            </v-col>
          </v-row>
        </vex-block>

        <v-divider />

        <div class="d-flex">
          <v-spacer />
          <vex-stack horizontal gap="16">
            <v-btn
              color="primary"
              outlined
              :disabled="loading"
              @click="cancel()"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :disabled="invalid"
              :loading="loading"
              @click="createAsset()"
            >
              Submit
            </v-btn>
          </vex-stack>
        </div>
      </vex-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import currency from 'currency.js';
  import { sentenceCase } from 'change-case';

  import {
    VexBlock,
    VexStack,
    VexTimeline,
    VexTimelineItem,
    VexTimelineAdd
  } from '@deip/vuetify-extended';
  import { UsersSelector } from '@deip/users-module';
  import { accountAvatarSrc } from '@deip/platform-fns';

  import { assetsMixin } from '../../mixins';

  const shareholderModel = () => ({
    account: undefined,
    amount: 0
  });

  export default {
    name: 'AssetCreate',
    components: {
      UsersSelector,
      VexBlock,
      VexStack,
      VexTimeline,
      VexTimelineItem,
      VexTimelineAdd
    },
    mixins: [assetsMixin],
    props: {
      project: {
        type: Object,
        required: true
      },
      teamData: {
        type: Object,
        required: true
      },
      projectAlias: {
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
          account: this.project.researchGroup.external_id,
          amount: this.formModel.maxSupply - tokensSpend
        };
      }
    },

    methods: {
      accountAvatarSrc,
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
          profile: {
            '!_id': this.formModel.holders.map((h) => h.account).filter((u) => u !== keepUser)
          }
        };
      },

      toPercent(amount) {
        return currency(
          (amount / this.formModel.maxSupply) * 100,
          {
            symbol: '%',
            pattern: '#!',
            negativePattern: '-#!'
          }
        ).format();
      },

      cancel() {
        this.$emit('cancel');
      },

      createAsset() {
        this.loading = true;
        const DEFAULT_PRECISION = 0;

        const data = [
          {
            privKey: this.$currentUser.privKey,
            username: this.$currentUser.username
          },
          {
            researchExternalId: this.project.externalId,
            researchGroup: this.project.researchGroup.external_id,
            symbol: this.formModel.symbol,
            precision: DEFAULT_PRECISION,
            description: '',
            maxSupply: parseInt(this.formModel.maxSupply + '0'.repeat(DEFAULT_PRECISION), 10),
            holders: [
              this.teamTokens,
              ...this.formModel.holders
            ].map((holder) => ({
              account: holder.account,
              amount: this.$$toAssetUnits({
                amount: holder.amount,
                assetId: this.formModel.symbol,
                precision: DEFAULT_PRECISION
              }, false)
            }))
          }
        ];

        this.$store.dispatch('assets/createProjectSecurityToken', data)
          .then(() => {
            this.$emit('success');
          })
          .catch((err) => {
            this.$emit('error', err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
