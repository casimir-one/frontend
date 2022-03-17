<template>
  <ve-stack>
    <v-sheet color="neutral lighten-5" rounded class="pa-6">
      <v-row>
        <v-col cols="2">
          <v-select
            v-model.number="filter.scope"
            label="Attributes scope"
            :items="scopesSelectorList"
            hide-details
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="filter.search"
            label="Search"
            hide-details
          />
        </v-col>
      </v-row>
    </v-sheet>

    <v-data-table
      :items="attributes"
      :headers="headers"

      :hide-default-footer="attributes.length < itemsPerPage"
      :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
      :items-per-page="itemsPerPage"

      :search="filter.search"
    >
      <template #item.scope="{ item }">
        <v-chip
          small
          readonly
          :color="scopesPalette[item.scope].background"
        >
          {{ scopeTypeInfo(item.scope).label }}
        </v-chip>
      </template>

      <template #item.type="{ item }">
        <v-chip small readonly>
          {{ attrTypeInfo(item.type).label }}
        </v-chip>
      </template>

      <template #item.markers="{ item }">
        <!--          'isEditable',-->
        <!--          'isFilterable',-->
        <!--          'isHidden',-->
        <!--          'isRequired',-->
        <!--          'isSystem'-->

        <ve-stack flow="column" :gap="8" class="justify-end">
          <vex-tooltip v-if="!item.isEditable" top tooltip="Not editable after first fill">
            <v-icon small class="text--disabled">
              mdi-file-cancel-outline
            </v-icon>
          </vex-tooltip>

          <vex-tooltip v-if="item.isFilterable" top tooltip="Used in filter">
            <v-icon small class="text--disabled">
              mdi-filter-variant
            </v-icon>
          </vex-tooltip>

          <vex-tooltip v-if="item.isHidden" top tooltip="Hidden field">
            <v-icon small class="text--disabled">
              mdi-eye-off-outline
            </v-icon>
          </vex-tooltip>

          <vex-tooltip v-if="item.isRequired" top tooltip="Required field">
            <v-icon small class="text--disabled">
              mdi-asterisk
            </v-icon>
          </vex-tooltip>
          <!-- <vex-tooltip v-if="item.blockchainFieldMeta" top tooltip="Form required.">-->
          <!-- <v-icon small class="text&#45;&#45;disabled">-->
          <!-- mdi-shield-alert-outline-->
          <!-- </v-icon>-->
          <!-- </vex-tooltip>-->

          <vex-tooltip v-if="item.isSystem" top tooltip="System field.">
            <v-icon small class="text--disabled">
              mdi-shield-alert-outline
            </v-icon>
          </vex-tooltip>
        </ve-stack>
      </template>

      <template #item.actions="{ item }">
        <ve-stack flow="column" :gap="8" class="justify-end">
          <v-btn
            icon
            x-small
            @click="onClickEdit(item)"
          >
            <v-icon
              small
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn
            icon
            x-small
            :disabled="item.isSystem"
            @click="onClickRemove(item._id)"
          >
            <v-icon
              small
            >
              mdi-delete
            </v-icon>
          </v-btn>
        </ve-stack>
      </template>
    </v-data-table>
  </ve-stack>
</template>

<script>
  import { genColorsPalette } from '@deip/toolbox';

  import {
    VexTooltip
  } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';

  /**
   * Component for creating list of attributes
   */
  export default {
    name: 'AttributesList',

    components: {
      VeStack,
      VexTooltip
    },

    props: {
      /**
       * Function that is executed when the Edit button is clicked
       */
      onClickEdit: {
        type: Function,
        default: () => {}
      },
      /**
       * Function that is executed when the Remove button is clicked
       */
      onClickRemove: {
        type: Function,
        default: () => {}
      }
    },

    data() {
      return {
        filter: {
          scope: 0,
          search: ''
        },

        itemsPerPage: 50
      };
    },

    computed: {
      /**
       * Get computed attributes list
       */
      attributes() {
        const filter = this.filter.scope ? { scope: this.filter.scope } : {};
        return this.$store.getters['attributes/list'](filter);
      },
      /**
       * Get computed registry attributes list
       */
      registryAttributes() {
        return this.$store.getters['attributesRegistry/list']();
      },
      /**
       * Get computed registry scopes list
       */
      registryScopes() {
        return this.$store.getters['scopesRegistry/list']();
      },
      /**
       * Get computed scopes selector list
       */
      scopesSelectorList() {
        return [
          { value: 0, text: 'All' },
          ...this.registryScopes.map((s) => ({ text: s.label, value: s.type }))
        ];
      },
      /**
       * Get computed scopes palette
       */
      scopesPalette() {
        return genColorsPalette({
          palette: ['#FFC255', '#FF8863', '#FF5484', '#CD3DA9', '#6846C0'],
          colorsCount: this.registryScopes.length
        }).reduce((acc, color, index) => ({
          ...acc,
          ...{ [this.registryScopes[index].type]: color }
        }), {});
      },
      /**
       * Get computed headers array
       */
      headers() {
        return [
          ...(!this.filter.scope ? [{
            text: 'Scope',
            value: 'scope',
            width: 1
          }] : []),
          {
            text: 'Type',
            value: 'type',
            width: 1
          },

          {
            text: 'Title',
            align: 'start',
            sortable: true,
            value: 'title'
          },
          {
            text: 'Short title',
            align: 'start',
            sortable: true,
            value: 'shortTitle'
          },
          {
            align: 'start',
            sortable: false,
            value: 'markers'
          },
          {
            align: 'end',
            sortable: false,
            value: 'actions'
          }
        ];
      }
    },

    created() {
      this.$store.dispatch('attributes/getList');
    },

    methods: {
      /**
       * Get attribute info by attribute type
       *
       * @param {string} attrType
       */
      attrTypeInfo(attrType) {
        return this.$store.getters['attributesRegistry/one'](attrType) || { type: attrType, label: attrType };
      },
      /**
       * Get scope info by scope type
       *
       * @param {string} scopeType
       */
      scopeTypeInfo(scopeType) {
        return this.$store.getters['scopesRegistry/one'](scopeType) || { type: scopeType, label: scopeType };
      }
    }

  };
</script>
