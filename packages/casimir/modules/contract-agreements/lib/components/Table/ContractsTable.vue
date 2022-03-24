<template>
  <v-data-table
    v-bind="tableProps"
    :items="mappedContracts"
    :headers="tableHeaders"
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

    <template #item.signedAt="{ item }">
      <vex-tooltip
        v-for="(signer, index) of item.signers"
        :key="index"
        tag="div"
        left
      >
        {{ formatDate(signer.date) }}

        <template #tooltip>
          {{ getPartyNameById(signer.id) }}
        </template>
      </vex-tooltip>
    </template>

    <template #item.status="{ item }">
      <v-chip
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
  // eslint-disable-next-line import/extensions,import/no-unresolved
  import { VDataTable } from 'vuetify/lib/components';
  import { CONTRACT_AGREEMENT_STATUS } from '@deip/constants';
  import { dateMixin } from '@deip/platform-components';
  import { userHelpersMixin } from '@deip/users-module';
  import { teamHelpersMixin } from '@deip/teams-module';
  import {
    VexTooltip,
    contextMixin,
    getBindableProps
  } from '@deip/vuetify-extended';

  const colorByStatus = {
    [CONTRACT_AGREEMENT_STATUS.PROPOSED]: 'neutral',
    [CONTRACT_AGREEMENT_STATUS.PENDING]: 'neutral',
    [CONTRACT_AGREEMENT_STATUS.APPROVED]: 'success',
    [CONTRACT_AGREEMENT_STATUS.REJECTED]: 'error'
  };
  /**
  * Component for creating a table of contracts
  */
  export default {
    name: 'ContractsTable',

    components: {
      VexTooltip
    },

    mixins: [
      dateMixin,
      userHelpersMixin,
      teamHelpersMixin,
      contextMixin
    ],

    props: {
      ...VDataTable.options.props,
      /**
       * Contracts list
       */
      contracts: {
        type: Array,
        default: () => []
      },
      /**
       * Сontract sender data
       */
      parties: {
        type: Array,
        default: () => []
      },
      /**
       * Account ID
       */
      currentPartyId: {
        type: String,
        default: null
      },
      /**
       * Interaction with the contract
       * default: false
       */
      canPerformActionsWithContract: {
        type: Function,
        default: () => false
      },
      /**
       * Contract statuses object
       * all contract statuses
       * @example {APPROVED: "Signed",PENDING: "Pending"}
       */
      statusLocale: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        discardLoadingContractId: null,
        tableHeaders: [
          { value: 'partyNames', text: this.$t('module.contractAgreements.table.parties') },
          { value: 'createdAt', text: this.$t('module.contractAgreements.table.created') },
          { value: 'signedAt', text: this.$t('module.contractAgreements.table.signed') },
          { value: 'status', text: this.$t('module.contractAgreements.table.status') },
          { value: 'actions', align: 'end', sortable: false }
        ]
      };
    },

    computed: {
      tableProps() {
        return getBindableProps.call(this, VDataTable.options.props);
      },
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
      /**
       * Get date
       * @param {string,number} date
       */
      formatDate(date) {
        if (typeof date === 'string') {
          return this.$$formatDate(this.$$parseISO(date), 'PP');
        }
        return this.$$formatDate(new Date(date), 'PP'); // millis
      },
      /**
       * Get the name of the contract to which the user is a party
       * @param {string} id
       */
      getPartyNameById(id) {
        const party = this.parties.find((p) => p._id === id);
        if (!party) {
          return null;
        }
        if (party.type === 'team') {
          return this.$$teamName(party);
        }
        return this.$$userFullName(party);
      },
      /**
       * Check status contract
       * @param {number} status
       */
      isPendingStatus(status) {
        return [CONTRACT_AGREEMENT_STATUS.PENDING,
                CONTRACT_AGREEMENT_STATUS.PROPOSED].includes(status);
      },
      /**
       * Get color for current status
       * @param {number} status
       */
      getStatusColor(status) {
        return colorByStatus[status];
      },
      /**
       * Get status string for view from i18n
       * @property {number} status
       */
      formatStatus(status) {
        const statusName = CONTRACT_AGREEMENT_STATUS[status];
        if (this.statusLocale) {
          return this.statusLocale[statusName];
        }
        return this.$t(`module.contractAgreements.status.${statusName}`);
      },
      /**
       * Contract select handler
       * @param {Object} contract data
       */
      handleContractRowClick(contract) {
        /**
         * Select contract event
         * Triggers when the contract selected on table row by click
         * @property {Object} contract data
         * @event click-row
         */
        this.$emit('click-row', contract);
      },
      /**
       * Get confirm discard contract popup
       * Triggers when user click cancel button
       * @param {Object} contract data
       */
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
