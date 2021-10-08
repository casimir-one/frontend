<template>
  <v-data-table
    :items="mappedContracts"
    :headers="tableHeaders"
    hide-default-footer
    disable-sort
    @click:row="handleContractRowClick"
  >
    <template #item.partyNames="{ item }">
      <div class="text-body-2 font-weight-medium">
        <template v-if="hasSlot('partyNames')">
          <slot name="partyNames" :contract="item" :parties="parties" />
        </template>

        <div
          v-for="(name, index) in item.partyNames"
          v-else
          :key="index"
        >
          {{ name }}
        </div>
      </div>
    </template>

    <template #item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>

    <!-- <template #item.signedAt="{ item }">
            <span v-if="item.signedAt">{{ formatDate(item.signedAt) }}</span>
          </template> -->

    <template #item.status="{ item }">
      <v-chip
        outlined
        :color="getStatusColor(item.status)"
      >
        {{ formatStatus(item.status) }}
      </v-chip>
    </template>

    <template #item.actions="{item}">
      <template v-if="hasSlot('actions')">
        <slot name="actions" :contract="item" />
      </template>

      <v-btn
        v-else-if="canPerformActionsWithContract(item)"
        icon
        small
        :title="$t('module.contractAgreements.discard')"
        :loading="discardLoadingContractId === item._id"
        :disabled="!isPendingStatus(item.status)"
        @click.stop="handleDiscardContract(item)"
      >
        <v-icon small>
          mdi-cancel
        </v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import { CONTRACT_AGREEMENT_STATUS } from '@deip/constants';
  import { dateMixin } from '@deip/platform-components';
  import { userHelpersMixin } from '@deip/users-module';
  import { teamHelpersMixin } from '@deip/teams-module';
  import { contextMixin } from '@deip/vuetify-extended';

  const colorByStatus = {
    [CONTRACT_AGREEMENT_STATUS.PROPOSED]: 'neutral',
    [CONTRACT_AGREEMENT_STATUS.PENDING]: 'neutral',
    [CONTRACT_AGREEMENT_STATUS.APPROVED]: 'success',
    [CONTRACT_AGREEMENT_STATUS.REJECTED]: 'error'
  };

  export default {
    name: 'ContractsTable',

    mixins: [
      dateMixin,
      userHelpersMixin,
      teamHelpersMixin,
      contextMixin
    ],

    props: {
      contracts: {
        type: Array,
        default: () => []
      },
      parties: {
        type: Array,
        default: () => []
      },
      currentPartyId: {
        type: String,
        default: null
      },
      canPerformActionsWithContract: {
        type: Function,
        default: () => false
      },
      statusLocale: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        discardLoadingContractId: null,
        tableHeaders: [
          { value: 'partyNames', text: this.$t('module.contractAgreements.table.parties'), width: '40%' },
          { value: 'createdAt', text: this.$t('module.contractAgreements.table.created') },
          { value: 'signedAt', text: this.$t('module.contractAgreements.table.signed') },
          { value: 'status', text: this.$t('module.contractAgreements.table.status') },
          { value: 'actions', align: 'end' }
        ]
      };
    },

    computed: {
      mappedContracts() {
        return this.contracts
          .map((c) => ({
            ...c,
            partyNames: c.parties.filter((id) => id !== this.currentPartyId)
              .map((id) => this.getPartyNameById(id))
          }));
      }
    },

    methods: {
      formatDate(date) {
        return this.$$formatDate(this.$$parseISO(date), 'PP');
      },

      getPartyNameById(id) {
        const party = this.parties.find((p) => p.entityId === id);
        if (!party) {
          return null;
        }
        if (party.type === 'team') {
          return this.$$teamTitle(party);
        }
        return this.$$userFullName(party);
      },

      isPendingStatus(status) {
        return [CONTRACT_AGREEMENT_STATUS.PENDING,
                CONTRACT_AGREEMENT_STATUS.PROPOSED].includes(status);
      },

      getStatusColor(status) {
        return colorByStatus[status];
      },

      formatStatus(status) {
        const statusName = CONTRACT_AGREEMENT_STATUS[status];
        if (this.statusLocale) {
          return this.statusLocale[statusName];
        }
        return this.$t(`module.contractAgreements.status.${statusName}`);
      },

      handleContractRowClick(contract) {
        this.$emit('click-row', contract);
      },

      handleDiscardContract(contract) {
        this.$confirm(this.$t('module.contractAgreements.discardAction.confirm.message'),
                      { title: this.$t('module.contractAgreements.discardAction.confirm.title') })
          .then((confirm) => {
            if (confirm) {
              this.discardLoadingContractId = contract._id;
              const payload = {
                initiator: this.$currentUser,
                data: {
                  account: this.currentPartyId,
                  proposalId: contract.proposalId
                }
              };
              this.$store.dispatch('contractAgreements/discard', payload)
                .then(() => this.$store.dispatch('contractAgreements/getOne', contract._id))
                .then(() => {
                  this.$notifier.showSuccess(this.$t('module.contractAgreements.discardAction.success'));
                })
                .catch((error) => {
                  console.error(error);
                  this.$notifier.showError(error.message);
                })
                .finally(() => {
                  this.discardLoadingContractId = null;
                });
            }
          });
      }
    }
  };
</script>
